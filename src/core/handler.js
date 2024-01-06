import Swal from "sweetalert2";
import { rowRender, rowUi, toast, url } from "./functions";
import { courseEditForm, courseForm, editDrawer, rowGroup, searchInput } from "./selector";

export const courseFormHandler = async (event) => {
    //you need async before trailing function
    
    event.preventDefault();
    //get form body
    const formData = new FormData(courseForm);

    const jsonData = JSON.stringify({
        title: formData.get("course_title"),
        short_name: formData.get("short_name"),
        fee: formData.get("course_fee"),
    });

    // header 
    const myHeader = new Headers();
    myHeader.append("Content-Type", "application/json");
    //disable form
    courseForm.querySelector("button").toggleAttribute("disabled");
    //sent to server
    // fetch(url("/courses"), {
    //     method: "POST",
    //     headers: myHeader,
    //     body: jsonData
    // })
    //     .then(res => res.json())
    //     .then(json => {
    //         //when data reached, stop disabled
    //         courseForm.querySelector("button").toggleAttribute("disabled");
    //         rowGroup.append(rowUi(json));
    //         courseForm.reset();
    //         toast("Course created successfully")
    //     });


    //if you use with async, await, then the follow steps
    const res = await fetch(url("/courses"), {
        method: "POST",
        headers: myHeader,
        body: jsonData
    });
    const json = await res.json();
    courseForm.querySelector("button").toggleAttribute("disabled");
    rowGroup.append(rowUi(json));
    courseForm.reset();
    toast("Course created successfully");
};

export const rowGroupHandler = (event) => {
    //console.log(event.target);
    const currentRow = event.target.closest("tr");
    const currentRowId = currentRow.getAttribute("course-id");

    if (event.target.classList.contains("row-del")) {
        Swal.fire({
            title: "confirm",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                event.target.toggleAttribute("disabled");
                fetch(url("/courses/" + currentRowId), {
                    method: "DELETE"
                }).then(res => {
                    event.target.toggleAttribute("disabled");
                    if (res.status === 204) {
                        toast("Course Deleted");
                        currentRow.remove();
                    }
                });
            }
        });
    } else if (event.target.classList.contains("row-edit")) {
        //get old value and show
        //then submit changes and update
        event.target.toggleAttribute("disabled");
        fetch(url("/courses/" + currentRowId)).then(res => res.json())
            .then(json => {
                event.target.toggleAttribute("disabled");
                courseEditForm.querySelector("#edit_course_title").value = json.title;
                courseEditForm.querySelector("#edit_short_name").value = json.short_name;
                courseEditForm.querySelector("#edit_course_fee").value = json.fee;
                courseEditForm.querySelector("#edit_course_id").value = json.id;
                editDrawer.show();
            })
    }

};

export const courseEditFormHandler = (event) => {
    event.preventDefault();
    //id, url, header, body, method
    const formData = new FormData(courseEditForm);
    const currentId = formData.get("edit_course_id");
    //form body
    const jsonData = JSON.stringify({
        title: formData.get("edit_course_title"),
        short_name: formData.get("edit_short_name"),
        fee: formData.get("edit_course_fee"),
    });
    //form header
    const myHeader = new Headers();
    myHeader.append("Content-Type", "application/json");

    courseEditForm.querySelector("button").toggleAttribute("disabled");

    fetch(url("/courses/" + currentId), {
        method: "PUT",
        headers: myHeader,
        body: jsonData,
    }).then(res => res.json()).then(json => {
        courseEditForm.querySelector("button").toggleAttribute("disabled");
        courseEditForm.reset();
        editDrawer.hide();
        const currentRow = rowGroup.querySelector(`[course-id = '${json.id}']`);
        currentRow.querySelector('.row-title').innerText = json.title;
        currentRow.querySelector('.row-short').innerText = json.short_name;
        currentRow.querySelector('.row-fee').innerText = json.fee;
        currentRow.querySelector('.row-id').innerText = json.id;
        //console.log(json);
        toast("Course updated successfully");
    })
};

export const searchInputHandler = (event) => {
    //console.log(searchInput.value);
    event.target.previousElementSibling.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
    stroke="currentColor" class="w-3 h-3 animate-spin">
    <path stroke-linecap="round" stroke-linejoin="round"
      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
    `;
    fetch(url("/courses/?title[like]=" + event.target.value))
        .then(res => res.json()).then(json => {
            event.target.previousElementSibling.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
        stroke="currentColor" class="w-4 h-4">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
        `;
            if (json.length) {
                rowRender(json);
            } else {
                rowGroup.innerHTML = `<tr><td colspan="5" class="px-6 py-4 text-center">There is no result found        <a href="http://${location.host}" class="text-blue-400 italic">Browse all</a>
            </td></tr>
            `;
            }
            //console.log(json);
        })
}

