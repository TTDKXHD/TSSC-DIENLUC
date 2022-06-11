//Tải bảng dữ liệu khi tải xong trang
onload = function () {
  return get_data_firebase();
};
//onload = setTimeout(get_data_firebase, 3000);

//Bật/tắt chuông để nhận được các cảnh báo
document.getElementById("enable_alert").addEventListener("click", function () {
  const current_volumn = document.getElementById("alert").muted;
  if (current_volumn == true) {
    document.getElementById("alert").muted = false;
    document.getElementById("volumn").innerHTML = "&#128266;";
    alert("Bạn đã bật chuông cảnh báo!");
  } else {
    document.getElementById("alert").muted = true;
    document.getElementById("volumn").innerHTML = "&#128263;";
    alert("Bạn đã tắt chuông cảnh báo!");
  }
});

//Thêm các hàm và khai báo các biến cần thiết, API của firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import {
  getDatabase,
  get,
  ref,
  set,
  child,
  update,
  remove,
  onChildChanged,
  onChildRemoved,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCHQSBfwII4CJpqcEvtK21--az6SQk6QAM",
  authDomain: "tssc-ttdkx-43c96.firebaseapp.com",
  databaseURL:
    "https://tssc-ttdkx-43c96-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tssc-ttdkx-43c96",
  storageBucket: "tssc-ttdkx-43c96.appspot.com",
  messagingSenderId: "121413906830",
  appId: "1:121413906830:web:36947d40f966a526fb34df",
};
const app = initializeApp(firebaseConfig);
const database = getDatabase();

//Lấy dữ liệu từ firebase
function get_data_firebase() {
  const database_ref = ref(database, "TSSC");
  get(child(database_ref, "/"))
    .then((snapshot) => {
      //const firebase_data = snapshot.val();
      //const firebase_size = snapshot.size;
      if (snapshot.exists()) {
        import_data_table(snapshot);
      } else {
        alert("Chưa có dữ liệu!");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

//Tự động cập nhật dữ liệu khi có sự thay đổi dữ liệu của bảng dữ liệu
onChildChanged(ref(database, "TSSC/"), () => {
  del_data_table();
  return get_data_firebase();
});
onChildChanged(ref(database, "refresh/"), () => {
  del_data_table();
  return get_data_firebase();
});

//Hàm xóa bảng dữ liệu
function del_data_table() {
  const data_table = document.getElementById("data_table");
  const row_data = data_table.getElementsByTagName("tr").length;
  for (let i = row_data - 1; i > 2; i--) {
    data_table.deleteRow(i);
  }
}

//Hàm tạo các hàng có dữ liệu vào bảng dữ liệu
function import_data_table(snapshot) {
  const data_table = document.getElementById("data_table");
  const data = snapshot.val();
  const row_number = snapshot.size;
  const data_id = Object.keys(data);
  for (let i = row_number - 1; i >= 0; i--) {
    let data_array = [];
    data_array.push(data_id[i]);
    data_array.push(data[data_id[i]]["sub"]);
    data_array.push(data[data_id[i]]["bay"]);
    data_array.push(data[data_id[i]]["open_time"]);
    data_array.push(data[data_id[i]]["close_time"]);
    data_array.push(data[data_id[i]]["prot"]);
    data_array.push(data[data_id[i]]["phase_a"]);
    data_array.push(data[data_id[i]]["phase_b"]);
    data_array.push(data[data_id[i]]["phase_c"]);
    data_array.push(data[data_id[i]]["phase_n"]);
    data_array.push(data[data_id[i]]["max_phase_a"]);
    data_array.push(data[data_id[i]]["max_phase_b"]);
    data_array.push(data[data_id[i]]["max_phase_c"]);
    data_array.push(data[data_id[i]]["remark"]);
    const row = document.createElement("tr");
    data_table.appendChild(row);
    for (let j = 0; j < 14; j++) {
      const cell = document.createElement("td");
      cell.innerHTML = data_array[j];
      row.appendChild(cell);
    }
    if ((i % 2) == 1){
      row.style.backgroundColor = "#ffb3b3";
    }
  }
}
