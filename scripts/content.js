//cariable declarion
var currency_url = "https://free.currconv.com/api/v7/convert?q=CNY_USD&compact=ultra&apiKey=6794cace11c7c0ba19d5"
var currency_rate = 0

//get the current CNY to USD rate
$.get(currency_url, function( data ) {
  $( ".result" ).html( data );
  currency_rate = data.CNY_USD
  //add warning letter
  $(".oversea-head:first").after("You are currently using automatic price converter to USD, the USD price are not guarantee 100% accuracy. (1¥ = "+currency_rate+" USD)")
  // console.log("Current rate:", currency_rate)
});

if (location.href.includes("https://world.taobao.com/")) {
  //searching for price
  // console.log("Taobao USD Injected!! [world.taobao]")

  $(window).on('load',function(){
    // console.log("[world.taobao] Loaded")
    // console.log("Number of item"$(".price").length)
    add_usd_price($(".price"))
  })

  function add_usd_price(price_elements) {
    // console.log("[add_usd_price] Called!!")
    price_elements.each(function(index, each_element) {
      original_price = parseFloat(each_element.textContent.substring(1))
      converted_price = (original_price * currency_rate).toFixed(2)
      each_element.textContent = each_element.textContent + " or " + converted_price + " USD"
    });
  }
}

