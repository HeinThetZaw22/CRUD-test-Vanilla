import Swal from "sweetalert2";
import { baseUrl } from "./config";
import { rowGroup, rowTemplate } from "./selector"

export const rowUi = ({id, title, short_name, fee}) => {
    const row = rowTemplate.content.cloneNode(true);
    row.querySelector('tr').setAttribute("course-id", id)
    row.querySelector('.row-id').innerText = id;
    row.querySelector('.row-title').innerText = title;
    row.querySelector('.row-short').innerText = short_name;
    row.querySelector('.row-fee').innerText = fee;
    
    return row;
}


export const rowRender = (arrFromServer) => {
    rowGroup.innerHTML = "";
    arrFromServer.forEach(rowObject => rowGroup.append(rowUi(rowObject)));

} 

export const url = (path) => {
    //path mean course, batches...
    return baseUrl+path;
}

export const toast = (message) => {
    const Toast = Swal.mixin({
        toast: true,
        position: "top-start",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "success",
        title: message
      });
}