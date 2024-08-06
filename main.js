const nbsClientWriter = require('./src/ClientWriter/v1/Places/NearbySearchClientWriter');

const ClientController = require('./src/ClientController/v1/Places');

function main() {

  const clientController = new ClientController('./config/credentials.json');
  clientController.setTargetDirectory('Ankara');
  clientController.initClient();
  clientController.run();
  //const nbscw = new nbsClientWriter('./placesData', "AIzaSyDdsZ0AJ0jq2GTHVlzE1bSkUnRtKHHAcWk", "json");

  //nbscw.fetchPlaceResponses();
  //nbscw.fetchPlaces();
}

main();
