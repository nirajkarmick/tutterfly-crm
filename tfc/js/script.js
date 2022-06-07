function myclickFunction() {
    var passwordinput = document.getElementById("myloginpassword");
    //this.toggleClass("fa-eye fa-eye-slash");
    var eyeicontoggle = document.getElementById('eyeicon');
    if (passwordinput.type === "password") {
        passwordinput.type = "text";
    } else {
        passwordinput.type = "password";
    }
}
$(".toggle-password").click(function() {
    $(this).toggleClass("fa-eye fa-eye-slash");
});

$(document).ready(function() {
    if ($(document).width() < 992) {
  		$(".searchhelp").removeClass('offset-2')
	}
    else {
        $(".searchhelp").addClass('offset-2')
    }
});
$(window).resize(function() {
    if ($(document).width() < 992) {
  		$(".searchhelp").removeClass('offset-2')
	}
    else {
        $(".searchhelp").addClass('offset-2')
   	}
});
function myFunction(elem){
	/*alert(elem.id);*/
var cls=' .myplus';
  	if($( "#"+elem.id+cls ).hasClass( "fa-plus" )){
  		/*alert('jdslfjsl')*/
		$( "#"+elem.id+cls ).removeClass('fa-plus').addClass('fa-minus');
   	}
   	else{
		$( "#"+elem.id+cls ).removeClass('fa-minus').addClass('fa-plus');
	   	}
}
new WOW().init();

var bdoywindowheight = $(window).height();
var bdoywindowwidth = $(window).width();
if($(window).width() < 768){
    $('body#home').css({'background-size': (100)+'%' + (100)+'%'});
}else {
    $('body#home').css({'background-size': (100)+'%' });
}
if($(window).width() < 768){
    $('body').css({'background-size': (100)+'%' + (50)+'%'});
}else {
    $('body').css({'background-size': (100)+'%' + (50)+'%'});
}
$(window).bind('resize', function(){
    var bdoywindowheight = $(window).height();
    var bdoywindowwidth = $(window).width();
    if($(window).width() < 768){
        $('body#home').css({'background-size': (100)+'%' + (100)+'%'});
    }else {
        $('body#home').css({'background-size': (100)+'%'});
    }
    if($(window).width() < 768){
        $('body').css({'background-size': (100)+'%' + (50)+'%'});
    }else {
        $('body').css({'background-size': (100)+'%' + (50)+'%'});
    }
});


$('#whytutterflyslider').owlCarousel({
    items:1,
    loop:true,
    /*nav:true,*/
    autoplay: true,
    autoPlaySpeed: 5000,
    autoPlayTimeout: 5000,
    autoplayHoverPause: true
});

$('#tutterflyfeature-slider').owlCarousel({
    items:1,
    loop:true,
    /*nav:true,*/
    autoplay: true,
    autoPlaySpeed: 5000,
    autoPlayTimeout: 5000,
    autoplayHoverPause: true
});




$(document).ready(function(){
    $('.minimize').on('click', function(){minimize();});
    $('.maximize').on('click', function(){maximize();});
});

function minimize(){
    $('#pullit-expend').addClass('minimized');
}

function maximize(){
    $('#pullit-expend').removeClass('minimized');
}

$('input').focus(function(){
    $(this).parents('.form-group').addClass('focused');
});

$('input').blur(function(){
    var inputValue = $(this).val();
    if ( inputValue == "" ) {
       //console.log(inputValue);
        $(this).removeClass('filled');
        $(this).parents('.form-group').removeClass('focused');
    } else {
        $(this).addClass('filled');
    }
});


