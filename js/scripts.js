$(function(){
	var sections = {},
        _height  = $(window).height(),
        i        = 0;

    // Grab positions of our sections 
	var count = 0;
    $('.slide').each(function(){
        sections[count] = $(this).offset().top;
		count++;
    });
	count =0;

    $(document).on('scroll mousedown DOMMouseScroll mousewheel keyups', function(){
        var pos = $(this).scrollTop();

        for(i in sections){
            if(sections[i] <= pos && sections[i] < pos + _height){
                $.each($('.navigation').find('li').find('a.active'), function () {
					$(this).removeClass('active');
				});
                $('#link_' + i).find('a').addClass('active');
            }  
        }
    });

	$('a[href^="#"]').on('click',function (e) {
	    e.preventDefault();
		var that = this;

	    var target = $(this).attr('href'),
	    $target = $(target);

	    $('html, body').stop().animate({
	        'scrollTop': $target.offset().top
	    }, 1500, 'swing', function () {
			if(!$(that).hasClass('active')) {
				$.each($('.navigation').find('li').find('a.active'), function () {
					$(this).removeClass('active');
				});
				$(that).addClass('active');
			}

	    });
	});

	// Form Validation
	$('#contact').on('click', '#submit_btn', function() {
		$('#form-error').html('');
		var error = false;
		error = validateEmpty($('#form-name'));
		error = validateEmpty($('#form-age'));
		error = validateEmpty($('#form-profession'));
		error = validatePhone($('#form-phone'));
		error = validateEmpty($('#form-address'));
		error = validateEmpty($('#form-message'));
		error = validateEmail($('#form-email'));
		$("#contact form input, #contact form textarea").keyup(function() {
			$(this).css('border-color', '');
		});
		if(error) {
			$('#form-error').append('Please provide proper input for highlighted fields.');
		} else {
			// data to be sent to server
			post_data = {
				'name': $('#form-name').val(),
				'age': $('#form-age').val(),
				'profession': $('#form-profession').val(),
				'phone': $('#form-phone').val(),
				'address': $('#form-address').val(),
				'message': $('#form-message').val(),
				'email': $('#form-email').val(),
				'salutation': $('#salutation').val(),
				'sex': $('input[name="sex"]:checked').val(),
			};

			$.post('contact.php', post_data, function(data) {
				$('#order-form')[0].reset();
				$('#form-result').html('Thanks for sending your order. We will get back to you soon.');
			}).fail(function(err) {
				$('#form-result').html('There was problem in sending mail. Please try again!');
			});
		}
	});


	var validateEmpty = function (field) {
		var error = false;
		if (field.val() == "" || field.val().length == 0) {
			field.css('border-color', 'red');
			error = true;
		}
		return error;
	};

	function trim(s) {
		return s.replace(/^\s+|\s+$/, '');
	}

	var validateEmail = function(field) {
		var error = false;
		var tfld = trim(field.val());
		var emailFilter = /^[^@]+@[^@.]+\.[^@]*\w\w$/;
		var illegalChars= /[\(\)\<\>\,\;\:\\\"\[\]]/;
		if(field.val() == "") {
			field.css('border-color', 'red');
			error = true;
		} else if (!emailFilter.test(tfld) || field.val().match(illegalChars)) {
			field.css('border-color', 'red');
			$('#form-error').append('Please enter valid email address. ');
			error = true;
		}
		return error;
	};

	var validatePhone = function(field) {
		var error = false;
		var stripped = field.val().replace(/[\(\)\.\-\ ]/g, '');
		if(field.val() == "") {
			field.css('border-color', 'red');
			error = true;
		} else if (isNaN(parseInt(stripped))) {
			error = true;
			$('#form-error').append('Please enter valid phone number. ');
		}
		return error;
	};
});
