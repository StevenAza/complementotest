var data__players;
var filter__result;
var arrayTemp = [];
$(document).ready(function () {
    $('select').formSelect();
    extractData();
    changeFilter();
    Filters();
    $('.modal').modal();
    registro();
});

/*
---------------------------------------
    TRAE LOS DATOS DE LA API
---------------------------------------
*/
function extractData() {
    $.ajax({
        data: {},
        method: "GET",
        url: 'https://www.balldontlie.io/api/v1/players',
        success: function (data) {
            data__players = data;
            fillTable(data__players.data);
        },
        error: function (error) {
            console.error("error ---", error);
        }
    })
}
/*
----------------------------------------
    LLENA LA TABLA DESDE EL OBJETO JSON
----------------------------------------
*/
function fillTable(data__filled) {
    var html__table = "";

    for (let index = 0; index < data__filled.length; index++) {
        html__table += "<tr>";
        html__table += "<td>" + data__filled[index]["first_name"] + "</td>";
        html__table += "<td>" + data__filled[index]["last_name"] + "</td>";
        html__table += "<td>" + data__filled[index]["team"]["full_name"] + "</td>";
        html__table += "<td>" + data__filled[index]["team"]["city"] + "</td>";
        var altura_player = data__filled[index]["height_feet"] == null ? " - " : data__filled[index]["height_feet"];
        html__table += "<td>" + altura_player + "</td>";
        html__table += "<td><button class='btn-floating btn-large waves-effect waves-light pink darken-2 operation__delete' onclick='deletePlayer("+index+")'><i class='material-icons'>delete</i></button></td>";
        if(data__filled[index]["id"]!= "none") {
            html__table += "<td><button data-target='modal1' class='btn-floating btn-large waves-effect waves-light purple darken-3' onclick='detail("+data__filled[index]["id"]+")'><i class='material-icons'>remove_red_eye</i></button></td>";
        }

  
        html__table += "</tr>";
    }
    $(".sect_table_data__body").html(html__table);
}

/*
----------------------------------------
    LLENA EL SELECT CON TODOS LOS EQUIPOS
----------------------------------------
*/
function extractTeam() {
    var html__select = "";
    for (let ind = 0; ind < data__players.data.length; ind++) {
        html__select += "<option value='" + data__players.data[ind]["team"]["id"] + "'>" + data__players.data[ind]["team"]["full_name"] + "</option>";
    }
    $("select[name='select__teams']").html(html__select);
    $('select').formSelect();
}

/* 
-----------------------------------------
            FILTROS
-----------------------------------------
*/
function changeFilter() {
    $(".cont__filter select[name='filter__select']").change(function () {
        $(".cont__input input").val("");
        filter__result = parseInt($(this).val());
        switch (parseInt($(this).val())) {
            case 1:
                $(".cont__input label").text("Nombre");
                $(".cont__input").removeClass("hide");
                $(".cont__input").addClass("show");
                $(".cont__teams").removeClass("show");
                $(".cont__teams").addClass("hide");
                break;
            case 2:
                $(".cont__input label").text("Apellido");
                $(".cont__input").removeClass("hide");
                $(".cont__input").addClass("show");
                $(".cont__teams").removeClass("show");
                $(".cont__teams").addClass("hide");
                break;
            case 3:
                extractTeam();
                $(".cont__teams").addClass("show");
                $(".cont__teams").removeClass("hide");
                $(".cont__input").removeClass("show");
                $(".cont__input").addClass("hide");
                break;

            default:
                console.log($(this).val());
                break;
        }
    });
}

function SearchValues(campo, value, vallevel2 = null) {
    arrayTemp = [];
    if (vallevel2) {
        for (let ind = 0; ind < data__players.data.length; ind++) {
            if (data__players.data[ind][campo][vallevel2] == value) {
                arrayTemp.push(data__players.data[ind]);
            }
        }
    }
    else {
        for (let ind = 0; ind < data__players.data.length; ind++) {
            if (data__players.data[ind][campo].toLowerCase() == value) {
                arrayTemp.push(data__players.data[ind]);
            }
        }
    }

    fillTable(arrayTemp);
}

function Filters() {
    $("#buscar").click(function () {
        switch (filter__result) {
            case 1:
                SearchValues("first_name", $(".cont__input input").val().toLowerCase());
                break;
            case 2:
                SearchValues("last_name", $(".cont__input input").val().toLowerCase());
                break;
            case 3:
                SearchValues("team", parseInt($(".cont__teams select").val()), "id");
                break;
            default:
                break;
        }
    });
}

function deletePlayer(index) {
    data__players.data.splice(index, 1);
    fillTable(data__players.data);
}

/*
        DETALLE
*/
function detail(id){

   
    $.ajax({
        data: {},
        method: "GET",
        url: 'https://www.balldontlie.io/api/v1/players/'+id,
        success: function (data) {
            $("#modal1 h4").text(data.first_name+" "+data.last_name);
            let alt_pul = data.height_inches == null ? "No hay dato" :  data.height_inches;
            $("#modal1 p.inch").text(alt_pul);
            let altura =  data.height_feet == null ? "No hay dato" :  data.height_feet;
            $("#modal1 p.feet").text(altura);
            $("#modal1 p.posicion").text(data.position);
            $(".team_inf .team_inf__nombre").text("Nombre: "+data.team.full_name);
            $(".team_inf .team_inf__division").text("División: "+data.team.division);
            $(".team_inf .team_inf__ciudad").text("Ciudad: "+data.team.city);
            $('#modal1').modal('open');
          
        },
        error: function (error) {
            console.error("error ---", error);
        }
    })
}

function registro(){
    $("#btnRegistro").click(
        function() {
            var formS = $("#data_register").serializeArray();
            console.log(formS);
            var objectPlayer = {};
            objectPlayer.id = "none";
            objectPlayer.first_name = formS[0]["value"];
            objectPlayer.last_name = formS[1]["value"];
            objectPlayer.height_feet = formS[2]["value"];
            objectPlayer.height_inch = formS[3]["value"];
            objectPlayer.position = formS[4]["value"];
            objectPlayer.team = {};
            objectPlayer.team.full_name = formS[5]["value"];
            objectPlayer.team.division = formS[7]["value"];
            objectPlayer.team.city = formS[6]["value"];

            data__players.data.push(objectPlayer);
            fillTable(data__players.data);
            M.toast({html: 'Se registró en la tabla :))'})
            $('#modal2').modal('close');
            
        }
        )
}