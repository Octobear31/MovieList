$('#butt').click(function () {
    var movie = $('#name').val();
    $.post('/mdbSearch', { name: movie }, function (data) {
        var title = "";
        var poster = "";
        if (!data) {
            $("#results").html("Please enter correct movie title");
        } else {
            $("#results").html("");
            for (var i = 0; i < data.length; i++) {
                title = data[i].title;
                year = data[i].release_date;
                type = data[i].vote_average;
                poster = data[i].poster_path;
                bg = data[i].backdrop_path;
                id = data[i].id;

                var cell = "<div class='cell'><h2>" + title + "</h2><h3>" + year + " / rating: " + type + "</h3><img src='https://image.tmdb.org/t/p/w500" + poster + "' alt='No poster' width=200 height=300 ><br><button class='addMov' class='add' dataId= '" + id + "'>Add to list</button><a href='/p" + id + "'><button class='view'>Details</button></a><p class='alreadyIn'></p></div>";
                $("#results").append(cell);
                $("#backToList").html("<button id='bcktolst' class='auth'>My movies</button>");
            };
            ////////////////////////// add to list
            $('.addMov').on('click', function () {
                var dataId = this.getAttribute("dataId");
                var self = this;
                $.post('/addMov', { dataId: dataId }, function (data) {
                    console.log(data);
                    self.nextElementSibling.nextElementSibling.innerHTML = data;
                    // $(".alreadyIn").html(data);
                });
            });
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
            $("#succ").html(data);
            // setTimeOut(function () {
            //     window.location.href = '/';
            // }, 2000);
            window.location.href = '/';
        });

    } else {
        $("#succ").html("Enter correct data");
    }
});
//////////////////////////////////////// authrozation part starts here
$('#login').click(function () {
    var alog = $('#alog').val();
    var apass = $('#apass').val();
    // console.log(log);        
    $.post('/authorization', { login: alog, password: apass }, function (data) {
        data = JSON.parse(data);
        console.log(data);
        if (data.auth == 'true') {
            window.location.href = '/';
        } else {
            $("#nope").html(data.message);
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
//////////////////////////////////// My movies on Screen
$('#butt').click(function () {
    var movie = $('#name').val();
    $.post('/mdbSearch', { name: movie }, function (data) {
        var title = "";
        var poster = "";
        if (!data) {
            $("#results").html("Please enter correct movie title");
        } else {
            $("#results").html("");
            for (var i = 0; i < data.length; i++) {
                title = data[i].title;
                year = data[i].release_date;
                type = data[i].vote_average;
                poster = data[i].poster_path;
                bg = data[i].backdrop_path;
                id = data[i].id;

                var cell = "<div class='cell'><h2>" + title + "</h2><h3>" + year + " / rating: " + type + "</h3><img src='https://image.tmdb.org/t/p/w500" + poster + "' alt='No poster' width=200 height=300 ><br><button class='addMov' class='add' dataId= '" + id + "'>Add to list</button><a href='/p" + id + "'><button class='view'>Details</button></a><p class='alreadyIn'></p></div>";
                $("#results").append(cell);
                $("#backToList").html("<button id='bcktolst' class='auth'>My movies</button>");
            };
            ////////////////////////// add to list
            $('.addMov').on('click', function () {
                var dataId = this.getAttribute("dataId");
                var self = this;
                $.post('/addMov', { dataId: dataId }, function (data) {
                    console.log(data);
                    self.nextElementSibling.nextElementSibling.innerHTML = data;
                    // $(".alreadyIn").html(data);
                });
            });
        }
        console.log(data);
    });
});


