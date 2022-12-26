let scores = 0
//проверка правильности ответа
$('input').click(function(){
    if (keyNow == 0 ) {
        return 0
    }
    else{
        let answer = $(this).val();
        console.log('Answer: ', answer);

        if (rightAnswer == $(this).val()){
            answerIsRight = true;
            $.ajax({
                url: '/api/change_player_score',
                method: 'post',
                data: {uuid: uuid_now, player: (keyNow==13?2:1), scores_to_add: 1},
                dataType: 'JSON',
                success:  function(data){
                    $('#score1').text(data.player_1_score);
                    $('#score2').text(data.player_2_score);
                    localStorage.setItem('winPlayer', 
                    (data.player_1_score > data.player_2_score ? localStorage.getItem('name1'): localStorage.getItem('name2')));
					console.log('winPlayer: ', localStorage.getItem('winPlayer'));
                    // $.ajax({ //след вопрос
                    //     url: '/api/get_next_question_for_game',
                    //     method: 'get',
                    //     dataType: 'JSON',
                    //     data: {uuid: uuid_now},
                    //     success: function(data){
                    //         let questionsPast = data.questions_past.trim().split(' ');
                    //         if (questionsPast[0] == '')
                    //             questionsPast.shift();
                    //         let curQuestionCount = questionsPast.length + 1;
                    //         if (curQuestionCount > data.questions_count)
                    //             location.reload();
                    //         else
                    //         {
                    //             $('#username1').text(localStorage.getItem('name1'));
                    //             $('#username2').text(localStorage.getItem('name2'));
                    //             $('#numberQuesNow').text('Вопрос номер ' + curQuestionCount);
                    //             $('.question').text(data.question);
                    //             rightAnswer = data.right_answer;
                    //             arr = [data.right_answer, data.answer_2, data.answer_3, data.answer_4];
                    //             arr = randomAnswer(arr);
                    //             $('answer-no').each(function(i){
                    //                 $this.val(arr[i]);
                    //             })
                    //         }
                    //     },
                    //     error: function(xhr, status, error) {
                    //         alert(xhr.responseText);
                    //     }
                    // });
                    // },
                },
                error: function(xhr, status, error) {
                    alert(xhr.responseText);
                }
            });
            time = 0;
            $('#answerUser1').css({display: 'none'});
            $('#answerUser2').css({display: 'block'});
            resetTimerGetQuestion();
        }
        else
        {
            $.ajax({
                url: '/api/change_player_score',
                method: 'post',
                data: {uuid: uuid_now, player: (keyNow==13?2:1), scores_to_add: -1},
                dataType: 'JSON',
                success:  function(data){
                    $('#score1').text(data.player_1_score)
                    $('#score2').text(data.player_2_score)
                    localStorage.setItem('winPlayer', 
                    (data.player_1_score > data.player_2_score ? localStorage.getItem('name1'): localStorage.getItem('name2')))
                    $.ajax({ //след вопрос
                        url: '/api/get_next_question_for_game',
                        method: 'get',
                        dataType: 'JSON',
                        data: {uuid: uuid_now},
                        success: function(data){
                            let questionsPast = data.questions_past.trim().split(' ');
                            if (questionsPast[0] == '')
                                questionsPast.shift();
                            let curQuestionCount = questionsPast.length + 1;
                            if (curQuestionCount > data.questions_count)
                                location.reload();
                            else
                            {
                                $('#username1').text(localStorage.getItem('name1'));
                                $('#username2').text(localStorage.getItem('name2'));
                                $('#numberQuesNow').text('Вопрос номер ' + curQuestionCount);
                                $('.question').text(data.question);
                                rightAnswer = data.right_answer;
                                arr = [data.right_answer, data.answer_2, data.answer_3, data.answer_4];
                                arr = randomAnswer(arr);
                                $('answer-no').each(function(i){
                                    $this.val(arr[i]);
                                })
                            }
                        },
                        error: function(xhr, status, error) {
                            alert(xhr.responseText);
                        }
                    });
                },
                error: function(xhr, status, error) {
                    alert(xhr.responseText);
                }
            });

            if (keyNow == 32 && time != 0){
                $('#answerUser1').css({display: 'none'});
                $('#answerUser2').css({display: 'block'});
                keyNow =  13;
            } 
            if (keyNow == 13 && time != 0){ 
                $('#answerUser1').css({display: 'block'});
                $('#answerUser2').css({display: 'none'});
                keyNow = 32;
            }
            
        }
    }
})