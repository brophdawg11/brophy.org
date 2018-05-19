import { shallowMount } from '@vue/test-utils';
import Header from '@components/Header.vue';

describe('Header Component', () => {
    let cmp;

    beforeEach(() => {
        cmp = shallowMount(Header);
    });

    it('has the proper name', () => {
        expect(cmp.name()).toEqual('Header');
    });

    it('renders properly', () => {
        expect(cmp.element).toMatchSnapshot();
    });

    it('renders the proper header content', () => {
        const div = cmp.find('.header');
        expect(div.text()).toBe('Header content');
    });
});
