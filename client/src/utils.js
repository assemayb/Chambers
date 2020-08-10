import axios from "axios";
 

export const authAxios = axios.create({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
});


export const prettifyLocation = (title) => {
  let roomtitle = title.split(" ");
    let newTitle = "";
    if (roomtitle.length === 1) {
      newTitle = roomtitle[0];
    } else {
      let arrLength = roomtitle.length;
      for (let i = 0; i < arrLength - 1; i++) {
        newTitle += roomtitle[i] += "_";
      }
      newTitle += roomtitle[arrLength - 1];
    }
    return newTitle
}