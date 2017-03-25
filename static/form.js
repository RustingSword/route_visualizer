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
                    <label>出发城市: </label><input type="text" name="from" list="cities">
                    <label>到达城市: </label><input type="text" name="to" list="cities">
                    <label>交通工具: </label>
                    <select type="text" name="vehicle">
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
