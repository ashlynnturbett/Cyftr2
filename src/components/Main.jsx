import React from 'react';
import logo from './resources/logo.png'
import loader from './resources/rainbow-loader.gif'

import uploadNav from './resources/uploadNav.png'
import loadingNav from './resources/loadingNav.png'
import completeNav from './resources/completeNav.png'

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      imageURL: '',
    };



    this.handleUploadFile = this.handleUploadFile.bind(this);
    this.handleUpdateFile = this.handleUpdateFile.bind(this);

  }


  handleUploadFile(ev){
    ev.preventDefault();

    const data = new FormData();
    data.append('file', this.uploadInput.files[0]);
    //data.append('filename', this.fileName.value);

    var uploadWindow = document.getElementById("upload-window");
    var waitingWindow = document.getElementById("verification-loading");
    var resultsWindow = document.getElementById("verification-complete");

    var uploadNav = document.getElementById("uploadNav");
    var loadingNav = document.getElementById("loadingNav");
    var completeNav = document.getElementById("completeNav");

	    	uploadWindow.classList.remove("m-fadeIn");
        uploadWindow.classList.add("m-fadeOut");
        waitingWindow.classList.remove("m-fadeOut");
		    waitingWindow.classList.add("m-fadeIn");

        uploadNav.classList.remove("m-fadeIn");
        uploadNav.classList.add("m-fadeOut");
        loadingNav.classList.remove("m-fadeOut");
		    loadingNav.classList.add("m-fadeIn");

    fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: data,
    }).then((response) => {
      response.json().then((body) => {

	    	waitingWindow.classList.remove("m-fadeIn");
        waitingWindow.classList.add("m-fadeOut");
        resultsWindow.classList.remove("m-fadeOut");
		    resultsWindow.classList.add("m-fadeIn");

        loadingNav.classList.remove("m-fadeIn");
        loadingNav.classList.add("m-fadeOut");
        completeNav.classList.remove("m-fadeOut");
		    completeNav.classList.add("m-fadeIn");

		    	   var headers = {
         room: 'Room'.replace(/,/g, ''), // remove commas to avoid errors,
         lname: "Last Name",
         fname: "First Name",
         pname: "Preferred Name",
         email: "Email",
         location: "Location",
         results: "Results",
         analysis: "Analysis"
	   };

	   var fileTitle = 'results'; // or 'my-unique-title'
        exportCSVFile(headers, body, fileTitle);
        renderResults(body);
      })
      .catch(error => {

        waitingWindow.classList.remove("m-fadeIn");
        waitingWindow.classList.add("m-fadeOut");
        uploadWindow.classList.remove("m-fadeOut");
		    uploadWindow.classList.add("m-fadeIn");

        loadingNav.classList.remove("m-fadeIn");
        loadingNav.classList.add("m-fadeOut");
        uploadNav.classList.remove("m-fadeOut");
		    uploadNav.classList.add("m-fadeIn");

        });
      });
    }
    
    handleUpdateFile(ev){
      ev.preventDefault();

      const data = new FormData();
      data.append('file', this.uploadInput.files[0]);

      var updateLbl = document.getElementById("FU-label");

      fetch('http://localhost:5000/update', { // TODO: CHECK UPLOAD URL. NEEDS "UPDATE" ??
      method: 'POST',
      body: data,
    }).then((response) => {
      response.json().then((body) => {

        updateLbl.classList.add("btn-hover");
        updateLbl.innerHTML = "Upload Completed";
        setTimeout(function(){
          updateLbl.classList.remove("btn-hover");
          updateLbl.innerHTML = "Upload Addresses";
        }, 3000);
      })
      .catch(error => {

        updateLbl.classList.add("btn-error");
        updateLbl.innerHTML = "File Upload Failed";
        setTimeout(function(){
          updateLbl.classList.remove("btn-error");
          updateLbl.innerHTML = "Upload Addresses";
        }, 3000);

        });
      });

    };




  render() {

    const JSONformat = <div>
      <div>&#123;</div>
      <div>&emsp;“1” : &#123;</div>
      <div>&emsp;&emsp;“fname” : “John” ,</div>
      <div>&emsp;&emsp;“lname” : “Smith” ,</div>
      <div>&emsp;&emsp;“addr1” : “110 Inner Campus Drive” ,</div>
      <div>&emsp;&emsp;“addr2” : “” ,</div>
      <div>&emsp;&emsp;“zip” : “78705”</div>
      <div>&emsp;&#123;</div>
      <div>&emsp;“2” : &#123;...&#125;</div>
      <div>&#125;</div>
    </div>

    const uploadForm = <form onSubmit={this.handleUploadFile}>
    <input id='file-upload' ref={(ref) => { this.uploadInput = ref; }} type='file' onChange={this.handleUploadFile} style={{visibility: 'hidden'}}/>
    <div class='upload-button'>
      <p style={{paddingBottom: '5px', color: '#757575'}}>Accepts .csv, .xlsx, .json</p>
      <label for='file-upload' class='button'>Upload Mailing List</label>
    </div>
  </form>

    const updateAddressesForm = <form onSubmit={this.handleUpdateFile}>
      <input id='file-update' ref={(ref) => { this.uploadInput = ref; }} type='file' onChange={this.handleUpdateFile} style={{visibility: 'hidden'}}/>
        <div class='update-button'>
          <p style={{paddingBottom: '5px', color: '#757575'}}>Accepts .csv, .xlsx, .json</p>
          <label id="FU-label" for='file-update' class='button'>Upload Addresses</label>
        </div>
      </form>

    return (
      <div>
        <div id = 'header'>
          <div id='logo'> <img id='logoImg' src={logo} alt='logo'></img></div>
          {/* <div id='user-icon' class='debug'></div> */}
        </div>
        <div id = 'sidebar' >
          <div id='nav' class="m-fadeOut">
            <div class="navDiv"><img id='uploadNav' src={uploadNav} alt='Upload Navigation' class="navImg m-fadeIn"></img></div>
            <div class="navDiv"><img id='loadingNav' src={loadingNav} alt='Loading Navigation' class="navImg m-fadeOut"></img></div>
            <div class="navDiv"><img id='completeNav' src={completeNav} alt='Complete Navigation' class="navImg m-fadeOut"></img></div>
          </div>
          {/* <div id='help'></div> */}
      </div>
      <div id = 'main' >
        <div id='app-window'>
          <div id='splash-window' class='app-inner m-fadeIn' style={{width: '95%'}}>
            <h2>Welcome to Cyftr!</h2>
            <span></span>
            <div>
              <label class="button verify-button" onClick={beginVerification}>Begin Verification</label>
            </div>
            <p>Begin the verification process by uploading your mailing list to Cyftr.</p>
            <br></br>
            <hr></hr>
            <h3>Update Address(es)</h3>
            <div>Upload new, accurate addresses to the Cyftr database.</div><div>Please format your file as shown below:</div>
            <p><strong>CSV &amp; Excel</strong></p>
            <table id='file-format-table'>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Address Line 1</th>
                <th>Address Line 2</th>
                <th>ZIP Code</th>
              </tr>
              <tr>
                <td>John</td>
                <td>Smith</td>
                <td>110 Inner Campus Drive</td>
                <td></td>
                <td>78705</td>
              </tr>
            </table>
            <p><strong>JSON</strong></p>
            <p style={{fontFamily: 'monospace'}}>{JSONformat}</p>
            <div id='update-addrs-form' class=''>
              {updateAddressesForm}
            </div>
            
          </div>
          <div id='upload-window' class='app-inner m-fadeOut'>
            <h2>Mailing List Upload</h2>
            <p>Upload your mailing list below to submit it to our verification system.</p>
            <br></br>
            <p>Please format your file as shown below:</p>
            <p><strong>CSV &amp; Excel</strong></p>
            <table id='file-format-table'>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Address Line 1</th>
                <th>Address Line 2</th>
                <th>ZIP Code</th>
              </tr>
              <tr>
                <td>John</td>
                <td>Smith</td>
                <td>110 Inner Campus Drive</td>
                <td></td>
                <td>78705</td>
              </tr>
            </table>
            <p><strong>JSON</strong></p>
            <p style={{fontFamily: 'monospace'}}>{JSONformat}</p>
            <div id='submit-form' class=''>
              {uploadForm}
            </div>
          </div>
          <div id='verification-loading' class='app-inner m-fadeOut'>
            <h2>Verification in Progress</h2>
            <p>Your upload has completed. Please wait for our system to compare your mailing list with our database.</p>
            <img id='loading-icon' src={loader}></img></div>
          <div id='verification-complete' class='app-inner m-fadeOut' >
            <h2>Verification Complete</h2>
            <p>Your mailing list has been processed. Here are the results.</p>
            <div style={{position: 'absolute', width: '175px', height: '100px'}} onClick={showAccurate}></div>
            <div style={{position: 'absolute', width: '175px', height: '100px', left: '200px'}} onClick={showPartial}></div>
            <div style={{position: 'absolute', width: '175px', height: '100px', left: '500px'}} onClick={showNot}></div>
            <table width='700px'>
              <tr style={{textAlign: 'left', fontSize: '15pt'}}>
                <th style={{color: '#128A09', paddingLeft: '20px'}}>Accurate</th>
                <th style={{color: '#FA5400', paddingLeft: '20px'}}>Partially Accurate</th>
                <th style={{color: '#D43F21', paddingLeft: '20px'}}>Not Accurate</th>
              </tr>
              <tr style={{textAlign: 'right', fontSize: '25pt', fontWeight: 'bold'}}>
                <td id='accuCount' style={{paddingRight: '20px'}}>##</td>
                <td id='partialCount' style={{paddingRight: '20px'}}>##</td>
                <td id='notCount' style={{paddingRight: '20px'}}>##</td>
              </tr>
              <tr style={{textAlign: 'right'}}>
                <td style={{paddingRight: '20px'}}>recipients</td>
                <td style={{paddingRight: '20px'}}>recipients</td>
                <td style={{paddingRight: '20px'}}>recipients</td>
              </tr>
            </table>
            <div class='table-container-container'>
              <div class='table-container'>
                <table id='accTbl' class='m-fadeIn' width='700px' style={{position: "absolute"}}>
                  <h4>Accurate Results</h4>
                  <tr style={{textalign: "left"}}>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Address Line 1</th>
                    <th>Address Line 2</th>
                    <th>ZIP</th>
                  </tr>
                </table>
              </div>
              <div class='table-container'>
                <table id='parTbl' class='m-fadeOut' width='700px' style={{position: "absolute"}}>
                <h4>Partially Accurate Results</h4>
                  <tr style={{textalign: "left"}}>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Address Line 1</th>
                    <th>Address Line 2</th>
                    <th>ZIP</th>
                    <th>Reason</th>
                  </tr>
                </table>
              </div>
              <div class='table-container'>
                <table id='notTbl' class='m-fadeOut' width='700px' style={{position: "absolute"}}>
              <h4>Not Accurate Results</h4>
                  <tr style={{textalign: "left"}}>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Address Line 1</th>
                    <th>Address Line 2</th>
                    <th>ZIP</th>
                    <th>Reason</th>
                  </tr>
                </table>
              </div>
            </div>
            <div class='download-button' style={{transform: 'translatey(45px)'}}>
              <label class='button' >Downloaded ✓</label>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  }
}

function renderResults(body){

      var accTbl = document.getElementById("accTbl");
      var parTbl = document.getElementById("parTbl");
      var notTbl = document.getElementById("notTbl");

      var accurateCount = 0;
      var partialCount = 0;
      var notCount = 0;

      for(const prop in body){
        if(prop == 0){

        } else if(body[prop].Result == "accurate"){

          accurateCount++;

          var order = ["FirstName", "LastName", "Room", "Location", "Location"]

          var newRow = accTbl.insertRow();

          for(const i in order){
          var newCell = newRow.insertCell();
          var newNode = document.createTextNode(body[prop][order[i]]);
          newCell.appendChild(newNode);
          }

        } else if(body[prop].Result == "partially accurate"){
          partialCount++;

          var order = ["FirstName", "LastName", "Room", "Location", "Location","Analysis"]

          var newRow = parTbl.insertRow();

          for(const i in order){
            var newCell = newRow.insertCell();
            var newNode = document.createTextNode(body[prop][order[i]]);
            newCell.appendChild(newNode);
            }

        } else {
          notCount++;

          var order = ["FirstName", "LastName", "Room", "Location", "Location","Analysis"]

          var newRow = notTbl.insertRow();

          for(const i in order){
            var newCell = newRow.insertCell();
            var newNode = document.createTextNode(body[prop][order[i]]);
            newCell.appendChild(newNode);
            }

        }
      }

      document.getElementById("accuCount").innerHTML = accurateCount;
      document.getElementById("partialCount").innerHTML = partialCount;
      document.getElementById("notCount").innerHTML = notCount;

      }

  function beginVerification() {

    var splash = document.getElementById("splash-window");
    var verification = document.getElementById("upload-window");
    var nav = document.getElementById("nav");

    splash.classList.remove("m-fadeIn");
    splash.classList.add("m-fadeOut");
    setTimeout(function(){
      verification.classList.remove("m-fadeOut");
      verification.classList.add("m-fadeIn");
      nav.classList.remove("m-fadeOut");
      nav.classList.add("m-fadeIn");
    }, 1000);
    
  
  }

function showAccurate() {

  var accTbl = document.getElementById("accTbl");
  var parTbl = document.getElementById("parTbl");
  var notTbl = document.getElementById("notTbl");

  parTbl.classList.remove("m-fadeIn");
  parTbl.classList.add("m-fadeOut");
  notTbl.classList.remove("m-fadeIn");
  notTbl.classList.add("m-fadeOut");
  accTbl.classList.remove("m-fadeOut");
  accTbl.classList.add("m-fadeIn");

}

function showPartial() {

  var accTbl = document.getElementById("accTbl");
  var parTbl = document.getElementById("parTbl");
  var notTbl = document.getElementById("notTbl");

  accTbl.classList.remove("m-fadeIn");
  accTbl.classList.add("m-fadeOut");
  notTbl.classList.remove("m-fadeIn");
  notTbl.classList.add("m-fadeOut");
  parTbl.classList.remove("m-fadeOut");
  parTbl.classList.add("m-fadeIn");

}

function showNot() {

  var accTbl = document.getElementById("accTbl");
  var parTbl = document.getElementById("parTbl");
  var notTbl = document.getElementById("notTbl");

  parTbl.classList.remove("m-fadeIn");
  parTbl.classList.add("m-fadeOut");
  accTbl.classList.remove("m-fadeIn");
  accTbl.classList.add("m-fadeOut");
  notTbl.classList.remove("m-fadeOut");
  notTbl.classList.add("m-fadeIn");

}

function convertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    return str;
}

function exportCSVFile(headers, items, fileTitle) {
    if (headers) {
        items.unshift(headers);
    }

    // Convert Object to JSON
    var jsonObject = JSON.stringify(items);

    var csv = convertToCSV(jsonObject);

    var exportedFilenmae = fileTitle + '.csv' || 'export.csv';

    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilenmae);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

export default Main;
