//cariable declarion
var currency_url = "https://free.currconv.com/api/v7/convert?q=CNY_USD&compact=ultra&apiKey=6794cace11c7c0ba19d5"
var currency_rate = 0.15335 //pre-define incase the rate api dose not work will not big issue
var warning_header = `
<div style="
    padding: 5px;
    text-align: center;
    font-weight: bold;
    color: blue;
    top: 0px;
    background-color: white;
">You are currently using automatic price converter to USD, the USD price are not guarantee 100% accuracy. (1¥ = 0.15335 USD)</div>`

//get the current CNY to USD rate
$.get(currency_url, function(data) {
    $(".result").html(data);
    currency_rate = data.CNY_USD
    //add warning letter
    $("body").prepend(warning_header)
    // console.log("Current rate:", currency_rate)
});


/////////////////////////////////////[https://world.taobao.com/]/////////////////////////////////////
//effect only content in taobao home page
if (location.href.includes("https://world.taobao.com/")) {
    // console.log("Taobao USD Injected!! [world.taobao]")
    $(window).on('load', function() {
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


/////////////////////////////////////[https://s.taobao.com/]/////////////////////////////////////
//effect only in taobao search page
if (location.href.includes("https://s.taobao.com/")) {
    // console.log("Taobao USD Injected!! [s.taobao]")


    //when the page is loaded
    $(window).on('load', function() {
        //find all box
        // console.log($("[data-category='auctions']").length)

        //resize all box to 420
        $("[data-category='auctions']").css("height", "420px");
        $("li.oneline").css('height', '320px')
        console.log($("li[class$='-item']"))
        $("li[class$='-item']").css('height', '415px')

        //start the custom price tag
        c_price_tag_main($("[data-category='auctions']"))
        c_price_tag_ads_side($("#J_shopkeeper [class$='-line1']"), 1)//element, tag location(U=1/D=0)
        // c_price_tag_ads_side($("#J_shopkeeper_bottom [class$='-line1']"), 0)//element, tag location(U=1/D=0) //checking

    })


    //purpose to detect of the user change items page
    jQuery('*:not(.nocapture)').on('click', function(e) {
        //detecting user click
        //compare the current and previous url for 5 times loop of 1second
        //if the url different recall the price tag replacement
        //else add new price tag again

        //compare the current and previous url for 5 times loop of 1second
        // Returns a Promise that resolves after "ms" Milliseconds
        const timer = ms => new Promise(res => setTimeout(res, ms))

        async function load() { // We need to wrap the loop into an async function for this to work
            for (var i = 0; i < 5; i++) {
                //check the existent of custom price tag
                var cpt_checker = $(".this_is_custom_price_tag").length
                // console.log(cpt_checker)
                //if no
                if (cpt_checker == 0) {
                    c_price_tag_main($("[data-category='auctions']"))
                } //else just go to other loop
                await timer(1000); // then the created Promise can be awaited
            }
        }

        load();
    })

    /**
     * @todo Handle J_shopkeeper price tag [s.taobao.com]
     * @body The advertisement items price tag on the side of main
     */
    function c_price_tag_ads_side(ads_price, tag_location) {
        //select all the price tag j shoper item list
        console.log(ads_price)
        ads_price.each(function(index, each_ad_price_box) {
            var ad_price_sec = $(this).find("[class$='-price']") //get the price tag
            var ad_original_price = parseFloat(ad_price_sec.get(0).outerText.substring(1)) //get the cny price
            var ad_usd_price = (ad_original_price * currency_rate).toFixed(2) //calculate the usd price
            var new_price_tag_html = ad_price_sec.clone().addClass("this_is_ads_custom_price_tag").append(" or " + ad_usd_price + " USD").css({
                'font-size': '15px',
                'margin-left': '10px'
            }).get(0).outerHTML //working on adding usd price with old price
            ad_price_sec.remove() //remove the old price tag
            if (tag_location==1) {
             $(this).before(new_price_tag_html + "<br>") //show the new price after the old price box
            }else{
             $(this).after(new_price_tag_html) //show the new price after the old price box
            }
        })
        //check on class name that contant the -price

        //change price tag with usd price and make it smaller

    }

    /**
     * @todo Handle J_shopkeeper_buttom price tag [s.taobao.com]
     * @body The advertisement items price tag on the buttom of main
     */


    function c_price_tag_main(item_boxs) {
        //in each box
        item_boxs.each(function(index, each_element) {
            var original_price = parseFloat($(this).find(".price>strong").get(0).innerHTML)
            var usd_price = (original_price * currency_rate).toFixed(2)
            //clone the price tag and style
            //adjust margin for new price tag
            //convert to html
            var original_price_html = $(this)
                .find(".price")
                .clone()
                .addClass("this_is_custom_price_tag")
                .append(`<span style="margin: 0px;"> or </span><strong>` + usd_price + " USD</strong>")
                .css({
                    "margin-top": "10px",
                    "margin-left": "10px",
                    "font-size": "15px"
                })
                .get(0)
                .outerHTML
            //change the information box margin, prevent the intent of price tag
            $(this).find(".price").remove()
            $(this).find(".ctx-box").css({
                "margin-top": "20px"
            })
            //add the cloned price tag under the picture
            $(this).find(".ctx-box").before(original_price_html + "<br>")
        });
    }
}

/**
 * @todo Handle detail.tmall.com price tag
 * @body The items price tag on the detial item in tmall
 */

/**
 * @todo Handle item.taobao.com price tag
 * @body The items price tag on the detial item in noraml taobao
 */