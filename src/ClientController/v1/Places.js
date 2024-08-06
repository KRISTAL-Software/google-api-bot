const FileHelper = require('../../utils/File/File');
const MathLab = require('../../utils/Math/Math');
const AreaValidator = require('../../utils/Validator/AreaValidator');
const GoogleClientv1 = require('../../ClientWriter/v1/Places/NearbySearchClientWriter');
const exception = require('../../utils/Error/Exception');


module.exports = class PlaceController 
{
    constructor(configPath)
    {
        this.configPath = configPath;
        this.targetDirectory = null;
        this.config = FileHelper.readJSON(configPath);
//        this.file = new FileHelper();
        this.math = new MathLab();
        this.validator = new AreaValidator();
        // this.config.api.GoogleProjectID,this.config.api.OAuth_AccessToken
        this.google = null;
    }

    setTargetDirectory(directoryName)
    {
      let foundedDirectory = this.config.targetDirectories.find(directory => directory.name === directoryName);
      if(foundedDirectory)
        this.targetDirectory = foundedDirectory.path ?? exception.json({
          error: "Error on setting the target directory",
          details: "Target directory is not adjusted because of missing path property",
          version: 'v1'
        });
      else
        exception.json({
          error: "Error on setting the target directory",
          details: "Target directory is not adjusted because of directory name is invalid",
          version: 'v1'
        });
    }

    initClient()
    {
      if(this.targetDirectory !== null)
        this.google = new GoogleClientv1(this.targetDirectory, this.config.api.API_KEY,'json');
      else
        exception.json({
        error: "Error on initializing the client",
        details: "Target directory is not initialized, specify a target",
        version: 'v1'
      });
    }

    async run() {
      for (const index in this.config.locations) {
        const area = this.config.locations[index];
      
        if (!this.validator.checkBool(area)) {
          continue;
        }
        console.log("This area is fetching now");
        console.log(area);
      
        let x = area.minLongitude;
        let y = area.minLatitude;
      
        const fetchAreaData = async () => {
          while (true) {
            // Check if the current coordinates are within the search radius
            if (this.math.isLongerThanRadius(x, y, area.originX, area.originY, area.radius)) {
              // Increment longitude and latitude to cover new areas
              x += 0.2 / (111 * Math.cos(y * Math.PI / 180)); // Convert to longitude degrees
              if (x >= area.maxLongitude) {
                x = area.minLongitude;
                y += 0.2 / 111; // Convert 0.5 km to latitude degrees
              }
              if (y >= area.maxLatitude) return; // End condition for latitude
              console.log("********************Outside search area " +x +" " +y +"*****************************");
              continue;
            }
      
            console.log("Searching location: " + x + " " + y + "\n");
      
            try {
              const places = await this.google.fetchPlaces(`${y},${x}`);
              console.log(places.length);
              
              // Increment coordinates to avoid overlap
              x += 0.2 / (111 * Math.cos(y * Math.PI / 180)); // Convert to longitude degrees
              if (x >= area.maxLongitude) {
                x = area.minLongitude;
                y += 0.2 / 111; // Convert to latitude degrees
              }
      
              if (y >= area.maxLatitude) return; // End condition for latitude
            } catch (error) {
              exception.json({
                error: error,
                details: 'An error occurred while fetching area in client controller',
                version: 'v1'
              });
              // Optionally, you can break or continue based on the error
              // return; // Uncomment to stop execution on error
            }
          }
        };
      
        try {
          await fetchAreaData();
          console.log(`${index} completed successfully`);
        } catch (error) {
          console.error("Error during fetching process:", error);
        }
      }
    }
    
    
    async getSpecificArea()
    {
        for (const index in config.locations) {
            const area = config.locations[index];
        
            if (await !this.validator.checkBool(area)) {
              continue;
            }
        
            let x = area.minLongitude, y = area.minLatitude;
        
            while (true) {
              if (
                await math.isLongerThanRadius(
                  x,
                  y,
                  area.originX,
                  area.originY,
                  area.radius
                )
              ) {
                x += 0.001;
        
                if (x >= area.maxLongitude) {
                  x = area.minLongitude;
                  y += 0.01;
                }
        
                if (y >= area.maxLatitude) return;
        
                console.log(
                  "********************Daire dışı alan " +
                    x +
                    " " +
                    y +
                    "*****************************"
                );
                continue;
              }
        
              console.log("Aranan konum: " + x + " " + y + "\n");
              let pageToken;
              do {
                const response = await google.getPlacesData(y, x, config.types);
                if (response.status === 500) {
                    console.error(response.data);
                    return;
                }
                
                const data = response;
                console.log(data);
                console.log("Aranan arkadaş : " + Object.keys(data).length);
        
                if (Object.keys(data).length > 0) {
                    const places = data.places || [];
                    for (let i = 0; i < places.length; i += 1) {
                        await file.write(
                            `${dir}${places[i].id}.json`,
                            JSON.stringify(places[i])
                        );
                    }
                }
                console.log(data);
                google.pageToken = data.nextPageToken || '';
              
                if (data.nextPageToken || '') {
                  console.log("Burdayım");
                    // Wait for a short period to ensure the next page token is valid
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
                
                console.log(google.pageToken);
          
            } while (pageToken);
              return;
              x += 0.001;
              if (x >= area.maxLongitude) {
                x = area.minLongitude;
                y += 0.001;
              }
        
              if (y >= area.maxLatitude) return;
            }
          }
          console.log("İŞLEM BİTTİ H.O");
    }
}


/*

When dealing with large radius searches like 50,000 meters (50 kilometers), it's important to calculate the appropriate increments in latitude and longitude to avoid overlapping areas and ensure comprehensive coverage.

Understanding the Radius
Radius and Increment Calculation:

Radius: 50,000 meters (50 kilometers).
Latitude and Longitude increments:
Latitude: 1 degree of latitude is approximately 111 kilometers.
Longitude: The distance covered by 1 degree of longitude varies depending on the latitude. At the equator, it's approximately 111 kilometers, but it decreases as you move towards the poles.
Calculating Increment:
To cover a radius of 50 kilometers, you need to set your increment size in latitude and longitude based on how much distance you want to move per step to avoid overlapping areas.

Here’s how you might calculate and adjust the increments for latitude and longitude:

Example Calculation for Latitude and Longitude Increments
Latitude Increment:

1 degree of latitude is approximately 111 kilometers.
To cover a radius of 50 kilometers, you might want to move by increments that ensure you cover the entire radius.
If you move by increments of 0.5 kilometers, then 50,000 meters / 500 meters = 100 increments.
javascript
Kodu kopyala
const latIncrement = 0.5 / 111; // Convert 0.5 kilometers to latitude degrees


Longitude Increment:

Longitude varies with latitude. At the equator, 1 degree of longitude is about 111 kilometers.
As latitude increases, the distance for 1 degree of longitude decreases. You may need to adjust based on latitude.
javascript
Kodu kopyala
const lonIncrement = 0.5 / (111 * Math.cos(y * Math.PI / 180)); // Convert 0.5 kilometers to longitu

*/