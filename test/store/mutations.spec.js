import mutations, { INCREMENT } from '@store/mutations';

describe('Mutations', () => {

    describe('INCREMENT', () => {

        it('should increment the counter', () => {
            const state = {
                count: 0,
            };

            mutations[INCREMENT](state, 1);
            expect(state.count).toEqual(1);
        });

    });

});
