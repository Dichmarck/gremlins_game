
//проверка правильности ответа
$('input').click(function(){
    if (keyNow == 0) {
        return 0
    }
    
    else{
        let player_to_change_score;
        if (keyNow == 13)
            player_to_change_score = 2;
        else
            player_to_change_score = 1;

        let scores;
        if (rightAnswer == $(this).val())
            scores = 1;
        else
            scores = -1;

        $.ajax({
            url: '/api/change_player_score',
            method: 'post',
            dataType: 'JSON',
            data: {uuid: uuid_now, player: player_to_change_score, scores_to_add: scores},
            success: function(data){
                console.log('data after score change:');
                console.log(data);
                $('#score1').text(data.player_1_score);
                $('#score2').text(data.player_2_score);
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }  
        })

        
    }
});

// $('.userAnswer').click(function(){
//     alert($(this).innerHTML);
// });