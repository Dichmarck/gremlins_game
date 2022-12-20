$('#form').submit(function (e) {
    e.preventDefault();
    let p = 1

    let name1 = $('#player_1_name').val()
    let name2 = $('#player_2_name').val()

    if (name1 == '') {
        alert('Введите имя Игрока 1 (букавками)')
        p = 0

    }
    if (name2 == '') {
        alert('Введите имя Игрока 2 (букавками)')
        p = 0
    }

    name1 = name1.toUpperCase()
    name2 = name2.toUpperCase()

    if (name1 == name2 && name1 != '') {
        alert('Шиза, конечно, может быть у всех, но игра для двух разных людей, хомосапиенсов')
        p = 0
    }

    let numberQues = parseInt($('#questions_count').val())
    let max = parseInt($('#questions_count').attr("max"))
    let min = parseInt($('#questions_count').attr("min"))

    if (numberQues > max) {
        alert('Хотите слишком много вопросов, у нас стлько нет, сбавьте обороты, пожалуйста')
        p = 0
    }

    if ((0 < numberQues) && (numberQues < min)){
        alert('Ну вы поиграть пришли или куда? Добавьте побольше вопросиков, чу как неродные')
        p = 0
    }

    if (numberQues < 0){
        alert('Посмотрите, у нас тут шутник')
        p = 0
    }

    if (p) $.ajax({
		url: '/api/create_game',
		method: 'get',
		dataType: 'JSON',
		data: $(this).serialize(),
		success: function(data){
			window.location.href = data;
        },
        error: alert('Ошибка соединения с сервером')
	});
})
