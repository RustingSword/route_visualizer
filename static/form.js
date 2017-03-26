$(document).ready(function() {
    var max_fields      = 10;
    var wrapper         = $(".container1");
    var add_button      = $(".add_form_field");
    var x = 1;
    $(add_button).click(function(e){
        e.preventDefault();
        if(x < max_fields){
            x++;
            $(wrapper).append(`
            <div>
                <div class="form-group">
                    <label>出发城市: </label><input type="text" name="from" list="cities" autocomplete="off">
                    <label>到达城市: </label><input type="text" name="to" list="cities" autocomplete="off">
                    <label>交通工具: </label>
                    <select name="vehicle">
                        <option value="plane">飞机</option>
                        <option value="car">汽车</option>
                    </select>
                    <button class="delete btn btn-danger">删除路线</button>
                </div>
            </div>`); //add input box
        }
        else
        {
            alert('You Reached the limits')
        }
    });
    $(wrapper).on("click",".delete", function(e){
        e.preventDefault(); $(this).parent('div').parent('div').remove(); x--;
    })
});

$(document).on('change input', function () {
    //setup before functions
    var typingTimer = null;         //timer identifier
    var doneTypingInterval = 1000;  //time in ms, 1 second for example
    var $input = $('input:focus');

    // updated events
    $input.keyup(function (e) {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(doneTyping, doneTypingInterval);
    });

    $input.on('keydown', function () {
        clearTimeout(typingTimer);
    })

    //user is "finished typing," do something
    function doneTyping () {
        console.log('search: ' + $(':focus').val());
        $.getJSON($SCRIPT_ROOT + '/geocode', {
            city_name: $(':focus').val()
        }, function(data) {
            console.log('result: ' + data.result);
            $('#cities').empty();
            data.result.forEach(function (city, i) {
                console.log(i + ' ' + city);
                $('<option />', {
                    val: city,
                    text: city
                }).appendTo($('#cities'));
            });
        });
    }
});
