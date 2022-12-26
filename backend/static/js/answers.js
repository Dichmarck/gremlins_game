let scores = 0
let winPlayer = null;

//проверка правильности ответа
$('input').click(function(e){
    var buttonAnswer = e.target
    console.log(keyNow)
    if (keyNow == 0 ) {
        return 0
    }
    
    else{
        
        if (rightAnswer == $(buttonAnswer).val()) {
            userStart = 0;
            $.ajax({
                url: "/api/change_player_score",
                method: "post",
                data: {
                    uuid: uuid_now,
                    player: keyNow == 13 ? 2 : 1,
                    scores_to_add: 1,
                },
                dataType: "JSON",
                success: function (data) {
                    $("#score1").text(data.player_1_score);
                    $("#score2").text(data.player_2_score);

                    let winPlayer = null;
                    if (data.player_1_score > data.player_2_score)
                        winPlayer = localStorage.getItem("name1");
                    else if (data.player_1_score < data.player_2_score)
                        winPlayer = localStorage.getItem("name2");

                    localStorage.setItem("winPlayer", winPlayer);
                    updateQuestion()
                },
                error: function (xhr, status, error) {
                    alert(xhr.responseText);
                },
            });
        } else {
            userStart = 0;
            $.ajax({
                url: "/api/change_player_score",
                method: "post",
                data: {
                    uuid: uuid_now,
                    player: keyNow == 13 ? 2 : 1,
                    scores_to_add: -1,
                },
                dataType: "JSON",
                success: function (data) {
                    $("#score1").text(data.player_1_score);
                    $("#score2").text(data.player_2_score);
                    let winPlayer = null;
                    if (data.player_1_score > data.player_2_score)
                        winPlayer = localStorage.getItem("name1");
                    else if (data.player_1_score < data.player_2_score)
                        winPlayer = localStorage.getItem("name2");

                    localStorage.setItem("winPlayer", winPlayer);
                    
                    if (keyNow == 32 && time != 0) {
                        $("#answerUser1").css({ display: "none" });
                        $("#answerUser2").css({ display: "block" });
                        keyNow = 13;
                    }
                    else {
                        $("#answerUser1").css({ display: "block" });
                        $("#answerUser2").css({ display: "none" });
                        keyNow = 32;
                    }
                },
                error: function (xhr, status, error) {
                    alert(xhr.responseText);
                },
            });
        }
        }
})