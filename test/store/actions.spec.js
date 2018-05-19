import actions, { INCREMENT_ASYNC } from '@store/actions';
import { INCREMENT } from '@store/mutations';

describe('Actions', () => {
    let mockStore;

    beforeEach(() => {
        mockStore = {
            state: {},
            commit: jest.fn(),
            dispatch: jest.fn(),
        };
    });

    describe(INCREMENT_ASYNC, () => {

        it('should increment the counter asynchronously', (done) => {
            const val = 5;
            actions[INCREMENT_ASYNC](mockStore, val).then(() => {
                expect(mockStore.commit.mock.calls.length).toBe(2);
                expect(mockStore.commit.mock.calls[0]).toEqual([
                    INCREMENT, val,
                ]);
                expect(mockStore.commit.mock.calls[1]).toEqual([
                    INCREMENT, val,
                ]);
            }).then(done, done);
        });

    });

});
