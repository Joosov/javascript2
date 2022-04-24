// finds all the cinemas from finnkino xml on page load
window.onload = function() {
  document.getElementById("selection").addEventListener("click", displayMovies);
  var area = new XMLHttpRequest();
  area.open("GET", "https://www.finnkino.fi/xml/TheatreAreas/", true); //
  area.send();
  area.onreadystatechange = function() {
      // If response is okay, loads the xml from the server
      if (area.readyState == 4 && area.status == 200) {
          var xml = area.responseXML;

          // gets the needed elements from the xml data and adds them to variable

          // Spesific theatre IDs
          var id = xml.getElementsByTagName("ID");
          //Names of the theatres
          var theatreName = xml.getElementsByTagName("Name");

          // Loops all theatrhes and adds them to the options in dropdown menu
          for (var i = 0; i < theatreName.length; i++) {
              var option = document.createElement("option");
              option.value = id[i].innerHTML;
              option.innerText = theatreName[i].innerHTML;
              city.appendChild(option);

          }

      }

  }

}

//contacts another xml-page to find the upcoming dates
var schedule = new XMLHttpRequest();
schedule.open("GET", "https://www.finnkino.fi/xml/ScheduleDates/", true);
schedule.send();
schedule.onreadystatechange = function() {
  if (schedule.readyState == 4 && schedule.status == 200) {
      var xml = schedule.responseXML;

      //finds date from xml
      var dateTime = xml.getElementsByTagName("dateTime");

      //finds startTime from dropdown menu
      var startTime = document.getElementById("startTime");

      // loop for creating new options to startTime dropdown, for 8 days
      for (var i = 0; i < 8; i++) {
          var optionDate = document.createElement("option");

          // fixes the time for later use in the URL using substringing
          var vuosi = dateTime[i].firstChild.data.substring(0, 4);
          var kuukausi = dateTime[i].firstChild.data.substring(5, 7);
          var paiva = dateTime[i].firstChild.data.substring(10, 8);
          var uusiPaiva = paiva + "." + kuukausi + "." + vuosi;
          optionDate.value = uusiPaiva;

          // creates a text node from the correct date
          var addDate = document.createTextNode(uusiPaiva);
          startTime.appendChild(optionDate);
          optionDate.appendChild(addDate);
      }
  }
}

//Runs when dropdown menus change 
function displayMovies() {

  area = document.getElementById("city").value;
  startTime = document.getElementById("startTime").value;
  var customSchedule = new XMLHttpRequest();

  //adds the city and modified starttime to url to find area info from wanted date
  customSchedule.open("GET", "https://www.finnkino.fi/xml/Schedule/?area=" + area + "&dt=" + startTime, true);
  customSchedule.send();
  customSchedule.onreadystatechange = function() {
      if (customSchedule.readyState == 4 && customSchedule.status == 200) {
          var xml = customSchedule.responseXML;
          var table = "<tr><th>ELOKUVA</th><th>TEATTERI</th><th>GENRE JA IKÄRAJA</th><th>ALKAA</th></tr>";
          var x = xml.getElementsByTagName("Show");

          for (i = 0; i < x.length; i++) {

              //adds film url, a small image, title of the film, theatre, rating, genre and starttime to the table
              table += "<tr><td><a target='_blank' href='" + x[i].getElementsByTagName("EventURL")[0].childNodes[0].nodeValue + "'>" +
                  "<img src=" +
                  x[i].getElementsByTagName("EventSmallImagePortrait")[0].childNodes[0].nodeValue + ">" +
                  x[i].getElementsByTagName("Title")[0].childNodes[0].nodeValue +
                  "</a" +
                  "</td><td>" +
                  x[i].getElementsByTagName("Theatre")[0].childNodes[0].nodeValue +
                  "</td><td>" + "<img id='small' src='" + x[i].getElementsByTagName("RatingImageUrl")[0].childNodes[0].nodeValue + "'>" +
                  x[i].getElementsByTagName("Genres")[0].childNodes[0].nodeValue +
                  "</td><td>" +
                  x[i].getElementsByTagName("dttmShowStart")[0].childNodes[0].nodeValue.substring(11, 16) +
                  "</td></tr>";
          }

          // adds loop results to id movies  
          document.getElementById("movies").innerHTML = table;
      }
  }
}