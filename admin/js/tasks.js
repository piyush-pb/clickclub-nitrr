
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
//   var initializeApp = require('firebase/app')
//   var getDatabase = require('firebase/database')

  const firebaseConfig = {
    apiKey: "AIzaSyASRBviDTbapzQxMA4qg9vlfanCOoe7nW4",
    authDomain: "website-549e7.firebaseapp.com",
    databaseURL: "https://website-549e7-default-rtdb.firebaseio.com",
    projectId: "website-549e7",
    storageBucket: "website-549e7.appspot.com",
    messagingSenderId: "432329841729",
    appId: "1:432329841729:web:2a0110028e21ccf193fac0",
    measurementId: "G-S8990ZLMGQ"
  };

  firebase.initializeApp(firebaseConfig);
  const database = firebase.database();

  // Get the current date and time
var currentDate = new Date();

// Convert to a Firebase-compatible format
var firebaseDate = currentDate.toISOString();

// show upcoming tasks
var c=1;
upcoming();
function upcoming(){
    
      var ref = firebase.database().ref('tasks');
        ref.orderByChild('timestamp').startAt(firebaseDate).on('value', function(snapshot) {
            jQuery("#uptasks").html("");
            c=1;
         snapshot.forEach(function(childSnapshot) {
             var key = childSnapshot.key;
             var childData = childSnapshot.val();              
    
             var ttitle = childSnapshot.val().title;
             var tdesc = childSnapshot.val().desc;
             var tdate = childSnapshot.val().timestamp;
    
             var d = new Date(tdate);
             var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
             var date = d.getDate() + " " + month[d.getMonth()] + ", " + d.getFullYear();
             var time = d.toLocaleTimeString().toLowerCase();
    
             console.log(date + " at " + time);
    
             var tasks = "<tr><th scope='row'>"+c+"</th><td>"+ ttitle +"</td><td>" + tdesc + "</td><td>" + date + " at " + time + "</td><td><span onclick='deletetask("+'"'+key+'"'+")'><i class='fa fa-trash'></i></span></td></tr>";
             jQuery("#uptasks").append(tasks);
             c++;
    
         });
      });
}
  var ref = firebase.database().ref('tasks');
    ref.orderByChild('status').on('value', function(snapshot) {
        upcoming();
     snapshot.forEach(function(childSnapshot) {
        if(childSnapshot.val().status){
         var key = childSnapshot.key;
         var childData = childSnapshot.val();              

         var ttitle = childSnapshot.val().title;
         var tdesc = childSnapshot.val().desc;
         var tstatus = childSnapshot.val().status;
         var tasks = "<tr><th scope='row'>"+c+"</th><td>"+ ttitle +"</td><td>" + tdesc + "</td><td>" + tstatus + "</td><td><span onclick='deletetask("+'"'+key+'"'+")'><i class='fa fa-trash'></i></span></tr>";
         jQuery("#uptasks").append(tasks);
         c++;
        }

     });
  });

  // show previous tasks

var ref = firebase.database().ref('tasks');
  ref.orderByChild('timestamp').endAt(firebaseDate).on('value', function(snapshot) {
    c=1;
    jQuery("#prevtasks").html("");
   snapshot.forEach(function(childSnapshot) {
       var key = childSnapshot.key;
       var childData = childSnapshot.val();              

       var ttitle = childSnapshot.val().title;
       var tdesc = childSnapshot.val().desc;
       var tdate = childSnapshot.val().timestamp;

       var d = new Date(tdate);
       var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

       var date = d.getDate() + " " + month[d.getMonth()] + ", " + d.getFullYear();
       var time = d.toLocaleTimeString().toLowerCase();

       console.log(date + " at " + time);

       if(childSnapshot.val().timestamp){
       var tasks = "<tr><th scope='row'>"+c+"</th><td>"+ ttitle +"</td><td>" + tdesc + "</td><td>" + date + " at " + time + "</td><td><span onclick='deletetask("+'"'+key+'"'+")'><i class='fa fa-trash'></i></span></tr>";
       jQuery("#prevtasks").append(tasks);
       c++;
        }

   });
});

  // new task
  jQuery("#createtask").submit(function(e) {
    e.preventDefault();
    //get values
    var title = jQuery("#newtasktitle").val();
    var desc = jQuery("#newtaskdesc").val();
    var dateStr = jQuery("#newtaskdate").val();
    var status = "to be decided";
    var data;
    if(dateStr==""){
        data = {title,desc,status};
    }
    else{
        var date = new Date(dateStr);
        var timestamp = date.toISOString();
        console.log({title,desc,timestamp});
        data = {title,desc,timestamp};
    }
    jQuery("#newtasktitle").val("");
    jQuery("#newtaskdesc").val("");
     // add data to database
     database.ref('tasks').push(data);


    //      var d = new Date(date);
    //      var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    //      var date = d.getDate() + " " + month[d.getMonth()] + ", " + d.getFullYear();
    //      var time = d.toLocaleTimeString().toLowerCase();

    //      console.log(date + " at " + time);
    //  var tasks = "<tr><th scope='row'>"+c+"</th><td>"+ title +"</td><td>" + desc + "</td><td>"+date + " at " + time+"</td></tr><tr>";
    //  jQuery("#alltasks").append(tasks);
    //  c++;

     jQuery('#modal').modal('toggle');
     
   });

function deletetask(key){
    var taskRef = firebase.database().ref('tasks/' + key);
    taskRef.remove()
    .then(() => {
      console.log("Task removed successfully");
    })
    .catch((error) => {
      console.error("Error removing task: ", error);
    });
}
