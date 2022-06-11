//Tải bảng dữ liệu khi tải xong trang
onload = function () {
  return get_data_firebase();
};
//onload = setTimeout(get_data_firebase, 3000);

//Hiện dòng trong bảng dữ liệu để điền các giá trị
document
  .getElementById("add_data_button")
  .addEventListener("click", function () {
    const data_table = document.getElementById("data_table");
    let add_row = data_table.getElementsByTagName("tr")[2];
    add_row.style.display = "table-row";
    const x = data_table.getElementsByTagName("tr").length;
    const id = x - 2;
    data_table.getElementsByTagName("input")[0].value = id;
  });

//Hiện bảng để chỉnh sửa dữ liệu
document
  .getElementById("edit_data_button")
  .addEventListener("click", function () {
    document.getElementById("edit_data_table").style.display = "table";
    document.getElementById("head_edit_data").style.display = "inline";
  });

//Tự điền dữ liệu khi muốn chỉnh sửa dữ liệu
document
  .getElementById("edit_data_table")
  .getElementsByTagName("input")[0]
  .addEventListener("input", auto_fill);

//Copy dữ liệu báo cáo
document.getElementById("input_report").addEventListener("input", report_text);
document.getElementById("copy_report").addEventListener("click", copy_text);

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

//Chỉnh sửa giá trị True/False trong firebase
document
  .getElementById("update_value_listen")
  .addEventListener("click", update_value_listen);

//Lấy và ghi dữ liệu thêm mới
document.getElementById("confirm").addEventListener("click", confirm);

//Nút bấm dự phòng
//document.getElementById("spare").addEventListener("click", refresh_all);

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

//Phát chuông cảnh báo khi bấm nút CẢNH BÁO
onChildChanged(ref(database, "listen/"), (data) => {
  var promise = document.getElementById("alert").play();
  if (promise !== undefined) {
    promise
      .then((_) => {
        document.getElementById("alert").play();
      })
      .catch((error) => {
        alert("Bạn chưa bật chuông cảnh báo!");
      });
  }
});

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

//Hàm chỉnh sửa giá trị True/False của my_value trong firebase
function update_value_listen() {
  const database_ref = ref(database);
  get(child(database_ref, "listen")).then((snapshot) => {
    const current_value = snapshot.val().my_value;
    const new_value = !current_value;
    const new_data = { my_value: new_value };
    update(child(database_ref, "listen"), new_data);
  });
}

//Hàm chỉnh sửa giá trị True/False của my_refresh trong firebase để cập nhật bảng dữ liệu
function refresh_listen() {
  const database_ref = ref(database);
  get(child(database_ref, "refresh")).then((snapshot) => {
    const current_value = snapshot.val().my_refresh;
    const new_value = !current_value;
    const new_data = { my_refresh: new_value };
    update(child(database_ref, "refresh"), new_data);
  });
}

//Hàm thêm dữ liệu vào firebase
function add_data_firebase(data) {
  const database_ref = ref(database, "TSSC/" + data.id);
  update(database_ref, data);
}

//Hàm lấy các phần tử của bảng thêm mới và chỉnh sửa
function get_element() {
  let my_element = [];
  const data_table = document.getElementById("data_table");
  const x = data_table.getElementsByTagName("input").length;
  const ghi_chu_data_table = data_table.getElementsByTagName("textarea");
  const select_data_table = data_table.getElementsByTagName("select");
  for (let i = 0; i < x; i++) {
    my_element.push(data_table.getElementsByTagName("input")[i]);
  }
  my_element.push(ghi_chu_data_table[0]);
  my_element.push(select_data_table[0]);
  my_element.push(select_data_table[1]);
  const edit_table = document.getElementById("edit_data_table");
  const y = edit_table.getElementsByTagName("input").length;
  const ghi_chu_edit_table = edit_table.getElementsByTagName("textarea");
  for (let i = 0; i < y; i++) {
    my_element.push(edit_table.getElementsByTagName("input")[i]);
  }
  const select_edit_table = edit_table.getElementsByTagName("select");
  my_element.push(ghi_chu_edit_table[0]);
  my_element.push(select_edit_table[0]);
  my_element.push(select_edit_table[1]);
  return my_element;
}

//Hàm kiểm tra muốn sửa dữ liệu hay thêm dữ liệu và thực hiện ghi dữ liệu
function confirm() {
  const my_element = get_element();
  const id_edit = my_element[14].value;
  const sub_add = my_element[12].value;
  if (id_edit == "" && sub_add == "Chọn TBA") {
    alert("Vui lòng điền đúng và đủ dữ liệu.");
  } else if (id_edit == "" && sub_add != "Chọn TBA") {
    confirm_add(my_element);
    refresh_listen();
    return refresh_all(my_element);
  } else if (id_edit != "" && sub_add == "Chọn TBA") {
    confirm_edit(my_element);
    refresh_listen();
    return refresh_all(my_element);
  } else {
    return refresh_all(my_element);
  }
}

//Hàm ghi dữ liệu chỉnh sửa
function confirm_edit(my_element) {
  const id = my_element[14].value;
  const sub = my_element[26].value;
  const bay = my_element[15].value;
  const open_time = my_element[16].value;
  const close_time = my_element[17].value;
  const prot = my_element[27].value;
  const phase_a = my_element[18].value;
  const phase_b = my_element[19].value;
  const phase_c = my_element[20].value;
  const phase_n = my_element[21].value;
  const max_phase_a = my_element[22].value;
  const max_phase_b = my_element[23].value;
  const max_phase_c = my_element[24].value;
  const remark = my_element[25].value;
  let data = {
    id: id,
    sub: sub,
    bay: bay,
    open_time: open_time,
    close_time: close_time,
    prot: prot,
    phase_a: phase_a,
    phase_b: phase_b,
    phase_c: phase_c,
    phase_n: phase_n,
    max_phase_a: max_phase_a,
    max_phase_b: max_phase_b,
    max_phase_c: max_phase_c,
    remark: remark,
  };
  add_data_firebase(data);
  document.getElementById("edit_data_table").style.display = "none";
  document.getElementById("head_edit_data").style.display = "none";
  alert("Ghi dữ liệu thành công.");
}

//Hàm ghi dữ liệu thêm mới
function confirm_add(my_element) {
  const id = my_element[0].value;
  const sub = my_element[12].value;
  const bay = my_element[1].value;
  const open_time = my_element[2].value;
  const close_time = my_element[3].value;
  const prot = my_element[13].value;
  const phase_a = my_element[4].value;
  const phase_b = my_element[5].value;
  const phase_c = my_element[6].value;
  const phase_n = my_element[7].value;
  const max_phase_a = my_element[8].value;
  const max_phase_b = my_element[9].value;
  const max_phase_c = my_element[10].value;
  const remark = my_element[11].value;
  let data = {
    id: id,
    sub: sub,
    bay: bay,
    open_time: open_time,
    close_time: close_time,
    prot: prot,
    phase_a: phase_a,
    phase_b: phase_b,
    phase_c: phase_c,
    phase_n: phase_n,
    max_phase_a: max_phase_a,
    max_phase_b: max_phase_b,
    max_phase_c: max_phase_c,
    remark: remark,
  };
  add_data_firebase(data);
  const data_table = document.getElementById("data_table");
  let add_row = data_table.getElementsByTagName("tr")[2];
  add_row.style.display = "none";
  alert("Ghi dữ liệu thành công.");
}

//Hàm tự điền dữ liệu khi muốn chỉnh sửa dữ liệu
function auto_fill() {
  const edit_table = document.getElementById("edit_data_table");
  const data_table = document.getElementById("data_table");
  const row_data_table = data_table.getElementsByTagName("tr").length;
  let edit_array = [];
  edit_array.push(edit_table.getElementsByTagName("input")[0]);
  edit_array.push(edit_table.getElementsByTagName("select")[0]);
  edit_array.push(edit_table.getElementsByTagName("input")[1]);
  edit_array.push(edit_table.getElementsByTagName("input")[2]);
  edit_array.push(edit_table.getElementsByTagName("input")[3]);
  edit_array.push(edit_table.getElementsByTagName("select")[1]);
  edit_array.push(edit_table.getElementsByTagName("input")[4]);
  edit_array.push(edit_table.getElementsByTagName("input")[5]);
  edit_array.push(edit_table.getElementsByTagName("input")[6]);
  edit_array.push(edit_table.getElementsByTagName("input")[7]);
  edit_array.push(edit_table.getElementsByTagName("input")[8]);
  edit_array.push(edit_table.getElementsByTagName("input")[9]);
  edit_array.push(edit_table.getElementsByTagName("input")[10]);
  edit_array.push(edit_table.getElementsByTagName("textarea")[0]);

  if (edit_array[0].value == "") {
    edit_array[1].value = "Chọn TBA";
    edit_array[2].value = "";
    edit_array[3].value = "";
    edit_array[4].value = "";
    edit_array[5].value = "Chọn bảo vệ";
    edit_array[6].value = "";
    edit_array[7].value = "";
    edit_array[8].value = "";
    edit_array[9].value = "";
    edit_array[10].value = "";
    edit_array[11].value = "";
    edit_array[12].value = "";
    edit_array[13].value = "";
  } else {
    if (row_data_table > 3) {
      for (let i = 3; i < row_data_table; i++) {
        const data_array = [];
        for (let j = 0; j < 14; j++) {
          const row = data_table.getElementsByTagName("tr")[i];
          data_array.push(row.getElementsByTagName("td")[j].innerHTML);
        }
        const id = Number(edit_array[0].value);
        const id_data = Number(data_array[0]);
        if (id == id_data) {
          for (let k = 1; k < 14; k++) {
            edit_array[k].value = data_array[k];
          }
        }
      }
    } else {
      alert("Chưa có dữ liệu!");
    }
  }
}

//Hàm tự điền dữ liệu báo cáo để copy
function report_text() {
  const input_report = document.getElementById("input_report").value;
  const data_table = document.getElementById("data_table");
  const row_data_table = data_table.getElementsByTagName("tr").length;
  const report = document.getElementById("report");
  let text;
  if (row_data_table > 3) {
    for (let i = 3; i < row_data_table; i++) {
      const data_array = [];
      for (let j = 0; j < 14; j++) {
        const row = data_table.getElementsByTagName("tr")[i];
        data_array.push(row.getElementsByTagName("td")[j].innerHTML);
      }
      const id = Number(input_report);
      const id_data = Number(data_array[0]);
      if (id == id_data) {
        if (data_array[5] == "Chạm đất nhạy"){
          text = "B8 báo cáo: " + "lúc " + data_array[3] + ", MC " + data_array[2] + data_array[1] +
                " nhảy bảo vệ " + data_array[5] + ", dòng chạm đất " + data_array[9] + " A" +
                ", ĐLT lúc " + data_array[4] + ".";
          
        }
        else if (data_array[5] == "Quá dòng"){
          text = "B8 báo cáo: " + "lúc " + data_array[3] + ", MC " + data_array[2] + data_array[1] +
                " nhảy bảo vệ " + data_array[5] + ", dòng sự cố (" + data_array[6] + " - " + data_array[7] + " - " + data_array[8] + ") (A)" +
                ", ĐLT lúc " + data_array[4] + ".";
        }
        else if (data_array[5] == "Chạm đất thanh cái"){
          text = "B8 báo cáo: " + "lúc " + data_array[3] + ", MC " + data_array[2] + data_array[1] +
                " nhảy bảo vệ " + data_array[5] + " pha ..." + ", ĐLT lúc " + data_array[4] + ".";
        }
        else {
          text = "B8 báo cáo: " + "lúc " + data_array[3] + ", MC " + data_array[2] + data_array[1] +
                " nhảy bảo vệ ..." + ", ĐLT lúc " + data_array[4] + ".";
        }
        document.getElementById("report").innerHTML = text;
      }
    }
  } else {
    alert("Chưa có dữ liệu!");
  }
}

//Hàm copy báo cáo
function copy_text(){
  let copyText = document.getElementById("report");
  //copyText.select();
  //copyText.setSelectionRange(0, 99999); //For mobile devices
  navigator.clipboard.writeText(copyText.innerHTML);
}

//Hàm xóa tất cả các giá trị nhập
function refresh_all(my_element) {
  for (let i = 0; i < 12; i++) {
    my_element[i].value = "";
  }
  my_element[12].value = "Chọn TBA";
  my_element[13].value = "Chọn bảo vệ";
  for (let i = 14; i < 26; i++) {
    my_element[i].value = "";
  }
  my_element[26].value = "Chọn TBA";
  my_element[27].value = "Chọn bảo vệ";
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
