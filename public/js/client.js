$('#butt').click(function () {
    var movie = $('#name').val();
    $.post('/mdbSearch', { name: movie }, function (data) {
        var title = "";
        var poster = "";
        if (!data) {
            $("#nomov").css("display", "block");
            $("#nomov").html("Please enter correct movie title");
            setTimeout("$('#nomov').css('display', 'none');", 1500);
        } else {
            $("#results").html("");
            for (var i = 0; i < data.length; i++) {
                title = data[i].title;
                year = data[i].release_date;
                type = data[i].vote_average;
                poster = data[i].poster_path;
                bg = data[i].backdrop_path;
                id = data[i].id;

                var cell = "<div class='cell'><div class='hdr2'>" + title + "</div><h3>" + year + "  |  rating: " + type + "/10</h3><img src='https://image.tmdb.org/t/p/w500" + poster + "' alt='Sorry, we can not find poster for this movie.' width=200 height=300 ><br><button class='addMov cellbutt none' dataId= '" + id + "'>Add to list</button><a href='/p" + id + "'><button class='view cellbutt'>Details</button></a><p class='alreadyIn'></p></div>";
                $("#results").append(cell);
                $("#backToList").html("<a href='/'><button id='bcktolst' class='auth'>My movies</button></a>");
            };
            ////////////////////////// add to list
            // $('.addMov').on('click', function () {
            //     var dataId = this.getAttribute("dataId");
            //     var self = this;
            //     $.post('/addMov', { dataId: dataId }, function (data) {
            //         console.log(data);

            //         // $(".alreadyIn").html(data);
            //         if (data == true) {
            //             self.nextElementSibling.nextElementSibling.innerHTML = "Movie has been added";
            //             self.remove();

            //         } else {
            //             self.nextElementSibling.nextElementSibling.innerHTML = data;
            //             self.remove();

            //         }
            //     });
            // });
        }
        console.log(data);
    });
});

$('#reg').click(function () {
    window.location.href = '/registration';
});
$('#log').click(function () {
    window.location.href = '/sign_in';
});
//////////////////////////////////// registration part stats here
$('#submit').click(function () {
    var log = $('#login').val();
    var mail = $('#email').val();
    var pass = $('#password').val();
    var rv_email = /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/;
    console.log(log);
    if (log != "" && (mail != "" && rv_email.test(mail)) && pass != "") {
        $.post('/registration', { login: log, email: mail, password: pass }, function (data) {
            $("#succ").css("display", "block");
            $("#succ").css("background", "#7AF8AC");
            $("#succ").css("border", "1px solid #02FC5A");
            $("#succ").html(data);
            setTimeout("window.location.href = '/';", 1000);
            // window.location.href = '/';
        });

    } else {
        $("#succ").css("display", "block");
        $("#succ").css("background", "#FDBDBD");
        $("#succ").css("border", "1px solid red");
        $("#succ").html("Please enter correct information");
    }
});
//////////////////////////////////////// authrozation part starts here
$('#logina').click(function () {
    var alog = $('#alog').val();
    var apass = $('#apass').val();
    // console.log(log);        
    $.post('/authorization', { login: alog, password: apass }, function (data) {
        data = JSON.parse(data);
        console.log(data);
        if (data.auth == 'true' && alog != "" && apass != "") {
            window.location.href = '/';
        } else {
            $("#nope").css("display", "block");

            $("#nope").html("Login name or password is incorrect");
        }
    });
});
//////////////////// sign out

$('#signOut').click(function () {
    $.post('/signOut', function (data) {
        if (data == 'true') {
            window.location.href = '/';
        }
    });
});


$('#wall').hover(function () {
    $('#why').toggle();
});


$('#buttL').click(function () {
    var movie = $('#name').val();
    $.post('/mdbSearchLog', { name: movie }, function (data) {
        var title = "";
        var poster = "";
        if (!data) {
            $("#nomov").css("display", "block");
            $("#nomov").html("Please enter correct movie title");
            setTimeout("$('#nomov').css('display', 'none');", 1500);

        } else {
            $("#results").html("");
            for (var i = 0; i < data.length; i++) {
                title = data[i].title;
                year = data[i].release_date;
                type = data[i].vote_average;
                poster = data[i].poster_path;
                bg = data[i].backdrop_path;
                id = data[i].id;

                var cell = "<div class='cell'><div class='hdr2'>" + title + "</div><h3>" + year + "  |  rating: " + type + "/10</h3><img src='https://image.tmdb.org/t/p/w500" + poster + "' alt='Sorry, we can not find poster for this movie.' width=200 height=300 ><br><button class='addMov cellbutt' dataId= '" + id + "'>Add to list</button><a href='/p" + id + "'><button class='view cellbutt'>Details</button></a><p class='alreadyIn'></p></div>";
                $("#results").append(cell);
                $("#backToList").html("<a href='/'><button id='bcktolst' class='auth'>My movies</button></a>");
            };
            ////////////////////////// add to list
            $('.addMov').on('click', function () {
                var dataId = this.getAttribute("dataId");
                var self = this;
                $.post('/addMov', { dataId: dataId }, function (data) {
                    console.log(data);

                    // $(".alreadyIn").html(data);
                    if (data == true) {
                        self.nextElementSibling.nextElementSibling.innerHTML = "Movie has been added";
                        self.remove();

                    } else {
                        self.nextElementSibling.nextElementSibling.innerHTML = data;
                        self.remove();

                    }
                });
            });
        }
        console.log(data);
    });
});

////////////////////////// delete movie

$('.remove').on("click", function () {
    var dataId = $(this).parent().attr("dataid");
    console.log(dataId);
    var self = $(this).parent();
    
    $.post('/deleteMov',{ dataid: dataId }, function (data) {
        if(data){
            $(self).remove();
        }
    });
});


