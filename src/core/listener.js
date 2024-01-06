import { debounce } from "lodash";
import { courseEditFormHandler, courseFormHandler, rowGroupHandler, searchInputHandler } from "./handler";
import { courseEditForm, courseForm, rowGroup, searchInput } from "./selector";

const listeners = () => {
    courseForm.addEventListener('submit', courseFormHandler);
    rowGroup.addEventListener('click', rowGroupHandler);
    courseEditForm.addEventListener('submit', courseEditFormHandler);
    searchInput.addEventListener('keyup', debounce(searchInputHandler, 500));
}

export default listeners;