$(document).ready(function(){

    $(".send_amount").on('change', set_rate)
    $(".send_amount").on('input', set_rate)
    $(".send_currency").on('change', set_rate)
    $(".receive_currency").on('change', set_rate)
    $(".rate-calculator-btn").on('click', function (event) {
        localStorage.send_amount = JSON.stringify($(".send_amount").val());
        localStorage.send_currency = JSON.stringify($(".send_currency").val());
        localStorage.receive_currency = JSON.stringify($(".receive_currency").val());
    })
});

function set_rate(){
    let send_amount = parseFloat($(".send_amount").val()).toFixed(2);
    let send_currency = $(".send_currency").val()
    let receive_currency = $(".receive_currency").val()
    let perrate = parseFloat(exrate[send_currency][receive_currency]).toFixed(2);
    let total_rate = parseFloat(perrate*send_amount).toFixed(2);

    $(".recipient_amount").val(total_rate)
}