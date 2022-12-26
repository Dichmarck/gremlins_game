let timer_answer = 1;
let keyNow = 0;
let numQues = 1;
let uuid_now = '';
let rightAnswer = '';
let curQuestion = '';
let timer_time = 10;
let time;

uuid_now = document.location.pathname.replace('/', '');

// при загрузке страницы вставляем значения никнеймов и очков игроков
$.ajax({
	url: '/api/get_game',
	method: 'get',
	dataType: 'JSON',
	data: {uuid: uuid_now},
	success: function(data){
		let questionsPast = data.questions_past.trim().split(' ');
		if (questionsPast[0] == '')
			questionsPast.shift();
		if (questionsPast.length >= data.questions_count)
			location.reload();

		$('#username1').text(data.player_1_name)
		$('#username2').text(data.player_2_name)
		$('#score1').text(data.player_1_score)
		$('#score2').text(data.player_2_score)

        localStorage.setItem('name1', data.player_1_name);
        localStorage.setItem('name2', data.player_2_name);
        localStorage.setItem('numQuestion', data.questions_count);	

		curQuestion = data.current_question
		if (curQuestion != '' && curQuestion != null){
			let button = document.getElementById('start_button');
			button.innerHTML = "ПРОДОЛЖИТЬ";
		}

		
	},
	error: function(xhr, status, error) {
        alert(xhr.responseText);
    }
});


function startTime() {
	document.getElementById("timer").innerHTML = timer_time;
}

function buttonsBlock() {
	window.getSelection().removeAllRanges();			
	let buttons = $('.answer-active')
	for (let i = 0; i < buttons.length; i++) {
		buttons[i].className = 'answer-no';
		buttons[i].setAttribute('type', 'button');
		buttons[i].blur();
	}
}

function buttonsActive() {
	window.getSelection().removeAllRanges();
	let buttons = $('.answer-no')
	for (let i = 0; i < buttons.length; i++) {
		window.getSelection().removeAllRanges();
		buttons[i].className = 'answer-active';
		buttons[i].blur();
		// buttons[i].setAttribute('type', 'submit')
	}
}

function randomAnswer(arr){
	var rand
	var final = []
	var i = 0
	while(i < 3){
		rand = Math.floor(Math.random()*arr.length)
		final.push(arr[rand])
		j = arr.indexOf(arr[rand])
		if (j >= 0) arr.splice(j, 1)
		i++
	}
	final.push(arr[0])
	return final
}


//старт игры и первый вопрос
$('button').click(function(){
	$('button').css({display:'none'})
	$('.quiz-interface').css({display:'flex'})

	$.ajax({
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

		console.log("start game DATA:");
		console.log(data);
		console.log('data questions past array:')
		console.log(data.questions_past.trim(' ').split(' '))
		console.log(curQuestionCount);
		
		console.log('вопрос номер ' + curQuestionCount);
        $('#numberQuesNow').text('Вопрос номер ' + curQuestionCount);
		$('.question').text(data.question)
		rightAnswer = data.right_answer
		arr = [data.right_answer, data.answer_2, data.answer_3, data.answer_4]

		arr = randomAnswer(arr)
		$('.answer-no').each(function(i){
			$(this).val(arr[i]);
		});
	},
	error: function(xhr, status, error) {
        alert(xhr.responseText);
    }
});

startTime();

 setInterval(function() {
	time = parseInt(document.getElementById("timer").textContent) - 1;
	document.getElementById("timer").innerHTML = time;

	//кто отвечает
	$(document).keydown(function(e){
		if (e.keyCode == 32 && timer_answer == 0 && keyNow == 0){
			$('#answerUser1').css({display: 'block'})
			keyNow =  32
		} 
		if (e.keyCode == 13 && timer_answer == 0 && keyNow == 0){ 
			$('#answerUser2').css({display: 'block'})
			keyNow = 13
		}
	})
	let i = 0
	

	//обновление таймера
	if (time == 0) {
		resetTimerGetQuestion();
	}
	else {
		buttonsActive();
		timer_answer = 0
		console.log(timer_answer + 'answer')
	}

	}, 1000);

});

function resetTimerGetQuestion(){
	document.getElementById("timer").innerHTML = timer_time;
	if (timer_answer == 0) {
		buttonsBlock();
		timer_answer = 1
		$('#answerUser2').css({display: 'none'})
		$('#answerUser1').css({display: 'none'})
		keyNow = 0

        $.ajax({
            url: '/api/get_next_question_for_game',
            method: 'get',
            dataType: 'JSON',
            data: {uuid: uuid_now},
            success: function(data){
            	console.log('Обновление таймера');
            	console.log(data);

            	let questionsPast = data.questions_past.trim().split(' ');
				if (questionsPast[0] == '')
					questionsPast.shift();
				let curQuestionCount = questionsPast.length + 1;
				if (curQuestionCount > data.questions_count)
		            location.reload();

                $('#numberQuesNow').text('Вопрос номер ' + curQuestionCount);
                console.log('вопрос номер ' + curQuestionCount);
                numQues++
                $('.question').text(data.question)
                rightAnswer = data.right_answer
                arr = [data.right_answer, data.answer_2, data.answer_3, data.answer_4]
                arr = randomAnswer(arr)
                $('.answer-no').each(function(i){
                    $(this).val(arr[i]);
                })
                console.log(data.questions_past)
            }
        });

		console.log(timer_answer + "question")
	}
}