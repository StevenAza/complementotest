var data__players;
$(document).ready(function(){
    extractData();
});

/*
----------------------------
    TRAE LOS DATOS DE LA API
----------------------------
*/
function extractData() {
    $.ajax({
        data: {},
        method: "GET",
        url: 'https://www.balldontlie.io/api/v1/players',
        success: function (data) {
            data__players = data;
            fillTable();
        },
        error: function(error) {
            console.error("error ---", error);
        }
    })
}

function fillTable(){
    var html__table = "";
  
    for (let index = 0; index < data__players.data.length; index++) {
        html__table+= "<tr>";
            html__table+="<td>"+data__players.data[index]["first_name"]+"</td>";
            html__table+="<td>"+data__players.data[index]["last_name"]+"</td>";
            html__table+="<td>"+data__players.data[index]["team"]["full_name"]+"</td>";
            html__table+="<td>"+data__players.data[index]["team"]["city"]+"</td>";
            var altura_player = data__players.data[index]["height_feet"] == null ? " - ": data__players.data[index]["height_feet"];
            html__table+="<td>"+altura_player+"</td>";

        html__table+= "</tr>";
     }
     $(".sect_table_data__body").html(html__table);
}