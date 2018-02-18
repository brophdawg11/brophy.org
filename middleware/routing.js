import { SET_PAGE_SCOPE } from '../store/mutations';

export default function (context) {
    if (context.store) {
        context.store.commit(SET_PAGE_SCOPE, null);
    }
}
