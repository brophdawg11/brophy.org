---
title: Nested Reactive Forms in Angular2
author: Matt Brophy
postDate: 2017-02-08 22:00
tags: angular2,javascript,functional,reactive,frp
---

Over at [URBN][urbn], I recently worked on a little internal app that involved a fairly complex nested form UI.  Having only done limited Angular2 work thus far, mostly using [NgUpgrade][ng-upgrade] against an existing Angular1 app, it was a great learning experience in some of the new form capabilities offered in Angular2.  However, I couldn't find many great examples involving nested forms that felt clean/maintainable/etc.  After a few days of hacking, I was pretty happy with what we ended up with, and super excited about the new [Reactive Forms][reactive-forms] in Angular2.  

Note that in this article, I've dumbed it all down to a simple nested example of dummy data.  Much simpler than what we were working with in the actual app, but a clear example of the pattern.

**TL;DR;** For those that just want to check out the code:
* The sample code is all up on [GitHub][github]
* A live demo is available via [GitHub-Pages][github.io]
* I also dumped it all into a [Plnkr][plnkr] for easy tweaking

## Template Driven Forms in Angular 1

Angular1 used a very template-driven approach to forms, so you'd see something like:

```javascript
$scope.data = {
    firstName: ''
}
```
```html
<input ng-model="data.firstName"
       ng-required="true"
       ng-maxlength="40"
       ng-pattern="^[a-zA-Z ]*" />
```

Admittedly, it was pretty slick as it provided real-time validation, error messages, etc. via the `FormController`.  However, as the complexities of your form grew, the amount of logic living in the templates grew as well, making it harder to maintain, unit test, etc.  Although I never used them directly, libraries like [Angular Formly][angular-formly] arose that tried to deal with this by moving logic out of the template and into the controller.

## Template Driven Forms in Angular 2

Along came Angular 2, and they kept a very similar pattern with their `FormsModule`:

```typescript
@Component(...)
export class TemplateDrivenForm {
    data: Object = {
        firstName: ''
    };
}
```
```html
<input [(ngModel)]="data.firstName" 
       required
       maxlength="40"
       pattern="^[a-zA-Z ]*" />
```

You'll notice they kept `ngModel`, but now support the native HTML5 input validation attributes - Neat!  However, this comes along with many of the same problems as the Angular 1 `ng-model` approach - as your form grows, your templates grow, and validation logic still lives mainly in the template.

## Reactive Forms in Angular 2

Enter the Angular 2 [Reactive Forms][reactive-forms] module.  I'll save you the details, but the main advantage as I see it, is moving the majority of your form logic, including validation, into your Components.  This completely takes the template out of the equation and leaves you with self-contained, easily-testable components.  For additional reading, here are a few of the articles I found most helpful when I was getting up to speed:

* [Template Driven vs Model Drive or Reactive Forms][template-vs-model]
* [Reactive Forms in Angular][reactive-forms-in-angular]
* [Angular2 Documentation for ReactiveForms][reactive-forms]
* [Angular2 Cookbook for Dynamic Forms][dynamic-forms]


## Nested Reactive Forms

Now that you're an expert in Reactive Forms from the above articles, we'll walk through the architecture we landed on, while noting some of the downsides of existing approaches we were able to find on the web.  Note that example code has been stripped down to the bare essentials for readability - please refer to the code on [GitHub][github] or [Plnkr][plnkr] for the full examples.

Here's the data structure we'll be using for our simple nested form:

```typescript
export interface ParentData {
    parentField1: string;
    parentField2: string;
    parentHiddenField1: string;
    children: ChildData[];
};

export interface ChildData {
    id: number;
    childField1: string;
    childField2: string;
    childHiddenField1: string;
};

```

Super simple.  A parent object which contains an array of child objects.  In the end, we want a single form that allows us to view and edit the entire nested structure, including adding/removing children.  Note that my actual app contained additional levels of nesting, but this pattern is easily extendable to meet additional levels.

The first example I came across was a post on [Scotch.io][nested-forms-in-angular2], which does a nice job of building the nested for in a single component, and then walking through pulling out the nested component.  This seemed pretty close to what we were looking for, and was actually quite close to what I had come up with in my first attempt, prior to abstracting out nested components.  However, there were a two main downsides to this approach in my opinion:

* In this final example, the template for the nested address form is moved down to an `AddressComponent`, but _all_ of the logic regarding _"What does an address look like"_ remains in the parent `AppComponent`.  This includes what an address data model looks like, as well as how to build an address `FormGroup` and all associated validations.  This seemed messy (and it gets called out by multiple people in the comments).  What's the point of abstracting the logic out if the parent component still has to maintain all of the knowledge about an address?
* The final little template section using `[formGroupName]="i"` and `<address [group]="myForm.controls.addresses.controls[i]"></address>` seemed messy.  The `formGroupName` seemed a little black-magic to me.  In my first construction of my app, I was using those to track `FormArray`'s, and it just felt...odd.

So I set out to see if I could clean this up, with a few goals in mind (according to our Parent/Child data structure above):

* The parent component shouldn't need to know about the structure of it's children.  Not the data model, not the form setup, validations, how to create/remove.  Nothing
* A single component should worry only about managing it's root level fields.  This goes for a parent and a child
* The parent component should, however, be acutely aware of the validity of the entire form, including all nested forms, so as to prevent submission on invalid root-level and nested user inputs
* A child component should only be required to set up a form for a single child data model.  It should not be responsible for adding/removing sibling children

So, where did I land?  the end architecture was basically:

```html
<parent-form>
    <child-list>
        <child-form *ngFor="let child of children">
        </child-form>
    </child-list>
</parent>
```


Let's take a look at them in some detail.

### Parent Form Component

The parent form component, as stated in the above goals, should focus solely on the `ParentData` object.  Here's how that looks:

```typescript
// parent-form.component.ts
@Component({
    selector: 'app-parent-form',
    templateUrl: './parent-form.component.html',
    styleUrls: [ './parent-form.component.css' ]
})
export class ParentFormComponent implements OnInit, AfterViewInit {
    public parentData: ParentData;
    public parentForm: FormGroup;

    constructor(private fb: FormBuilder) {}

    ngOnInit() {
        this.parentData = this.getParentData();
        this.parentForm = this.toFormGroup(this.parentData);
    }

    private getParentData(): ParentData {
        // Insert mock object here.  Likely provided via a resolver in a 
        // real world scenario
        return { ... };
    }

    private toFormGroup(data: ParentData): FormGroup {
        const formGroup = this.fb.group({
            parentField1: [ data.parentField1, Validators.required ],
            parentField2: [ data.parentField2, Validators.required ],
            parentHiddenField1: [ data.parentHiddenField1 ]
        });

        return formGroup;
    }
}
```

That seems pretty close to what we wanted.  It knows about a `ParentData` object, and it knows how to generate a `FormGroup` for the root-level fields of the `ParentData`.  Form validation is all contained in the component, making for easy isolated unit testing of form validation logic.  

Now, the template:

```html
<!-- parent-form.component.html -->
<form [formGroup]="parentForm">
    <label for="parentField1">Parent Field 1</label>
    <input formControlName="parentField1" />

    <br/>

    <label for="parentField2">Parent Field 2</label>
    <input formControlName="parentField2" />

    <app-child-list
        [parentForm]="parentForm"
        [children]="parentData.children">
    </app-child-list>
</form>
```

That's it, we set up a few `FormControl`'s in our component above, and we just link them to inputs in the template.  Note the immediate simplicity of removing any `required`/`pattern`/`maxlength` attributes.  All of those can be specified via `Validators` in the `FormControl`.  

### Child List Component

In order to prevent the parent from caring about it's children (that sounds bad - my parents are great - this is not a slight at them - I promise), we've delegated all of that down to a `ChildListComponent`, into which we pass our parent `FormGroup` and the array of `children`:

```typescript
// child-list.component.ts
@Component({ ... })
export class ChildListComponent implements OnInit {
    @Input('parentForm')
    public parentForm: FormGroup;

    @Input('children')
    public children: ChildData[];

    constructor(private cd: ChangeDetectorRef) { }

    ngOnInit() {
        this.parentForm.addControl('children', new FormArray([]));
    }
}
```

Huh.  That's too simple, right?  I mean, what exactly does this do if it's literally this small?  In the simplest case, this list component is strictly in charge of managing an array of children.  It does not, at the moment, care what a `ChildData` object looks like, it just knows that it's an array, and therefore it initializes an empty `FormArray` and attaches it to the parent form.  That's a pretty key detail there though - remember the goal of the parent being _"acutely aware of the validity of the entire form"_?  By attaching a new `FormArray`  control directly to the parent form, we'll get direct access in the parent controller to a data structure like the following:

```typescript
parentForm.value = {
    parentField1: string;
    parentField2: string;
    children: []
}
```

And that's without the parent component `FormGroup` doing anything with `children` or `FormArray`'s.  Cool, that seems like a nice separation of concerns.

So, now we look at the template for the `ChildListComponent`:

```html
<div [formGroup]="parentForm">
    <div formArrayName="children">
        <div *ngFor="let child of children">
            <app-child-form
                [children]="parentForm.controls.children"
                [child]="child">
            </app-child-form>
        </div>
    </div>
</div>

```

Again, that's super simple.  We're basically saying the following:

* I'm working within the `parentForm`
* I'm working on the `children` array of that form
* For each of those children, instantiate an `<app-child-form>` component, into which I'll pass the `children: FormArray` and the `child: ChildData` objects into

### Child Form Component

```typescript
// child-form.component.ts
@Component({ ... })
export class ChildFormComponent implements OnInit {
    @Input('children')
    public children: FormArray;

    @Input('child')
    public child: ChildData;

    public childForm: FormGroup;

    constructor(private fb: FormBuilder) {}

    ngOnInit() {
        this.childForm = this.toFormGroup(this.child);
        this.children.push(this.childForm);
    }

    private toFormGroup(data: ChildData) {
        const formGroup = this.fb.group({
            id: [ data.id ],
            childField1: [ data.childField1 || '', Validators.required ],
            childField2: [ data.childField2 || '', Validators.required ],
            childHiddenField1: [ data.childHiddenField1 ]
        });

        return formGroup;
    }
}
```

Cool, now we're down to the nitty gritty of what a `ChildData` and it's associated form looks like.  Notice how this component has _no idea_ of what a `ParentData` or `parentForm` object is?  That's good.  All this component should need to know how to do is (1) setup a `FormGroup` for it's `child` instance, and (2) attach that to the `children: FormArray` we got from the `ChildListComponent`.  This is again a key point.  Remember that the incoming `FormArray` has already been attached to the `parentForm` in the list component.  By attaching our childForm to the parent `FormArray`, we've attached it to the `parentForm`, which we actually know nothing about.  But it provides the `parentForm` awareness into the global validity of the entire form, all the way down to the child level.

And then, the final template:

```html
<!-- child-form.component.html -->
<div [formGroup]="childForm">
    <label for="childField1">Child Field 1</label>
    <input formControlName="childField1" />
    <br/>
    <label for="childField1">Child Field 2</label>
    <input formControlName="childField2" />
</div>

```

And that's it.  This child form template is, not surprisingly, setting up inputs for it's `FormControl`'s within it's own `childForm: formGroup`.

### Summary

So the final architecture and delegated responsibilities is:

* A `ParentFormComponent` who knows only about root level `ParentData` fields and how to prompt for them in inputs, nothing about it's children's structures or forms
* A `ChildListComponent` who knows only about an array of children, and is responsible for managing the array, but not the contents or the associated forms
* A `ChildFormComponent` who knows only about it's own root level `ChildData` fields, and simply attaches it's own form to the incoming `FormArray`

For more advanced usages of this setup, including form submission, adding/removing children, autosaving, undo/redo, and resetting form state - check out [the follow up post][continued].  Thanks for reading!


[urbn]: http://www.urbn.com "URBN"
[plnkr]: https://plnkr.co/edit/9Lqv7uXFMjhFDr932VG2?p=preview "Plnkr"
[github]: https://github.com/brophdawg11/ng-playground/tree/master/src/app/nested-forms "Nested Forms on GitHub"
[github.io]: https://brophdawg11.github.io/ng-playground/nested-form "Nested Forms Demo"
[angular-formly]: http://angular-formly.com/ "Angular Formly"
[template-vs-model]: http://blog.angular-university.io/introduction-to-angular-2-forms-template-driven-vs-model-driven/ "Template Driven vs Model Driven or Reactive Forms"
[reactive-forms-in-angular]: https://blog.thoughtram.io/angular/2016/06/22/model-driven-forms-in-angular-2.html "Reactive Forms in Angular"
[reactive-forms]: https://angular.io/docs/ts/latest/guide/reactive-forms.html "Reactive Forms"
[dynamic-forms]: https://angular.io/docs/ts/latest/cookbook/dynamic-form.html "Dynamic Forms"
[ng-upgrade]: https://angular.io/docs/ts/latest/guide/upgrade.html "NgUpgrade"
[nested-forms-in-angular2]: https://scotch.io/tutorials/how-to-build-nested-model-driven-forms-in-angular-2 "Nested Forms in Angular2"
[continued]: /post/nested-reactive-forms-in-angular2-continued/ "Nested Reactive Forms in Angular2, Continued"
