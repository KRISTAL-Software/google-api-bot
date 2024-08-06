module.exports = {
    restaurantFromRestaurantList: function() {
        return () => {
            // Collect all elements with the specified class name
            const liArray = Array.from(document.getElementsByClassName('content-section'));
            return {
                location: document.location,
                title: document.title,
                url: document.URL,
                array: liArray.map(li => li), // Adjust as needed,
                length: liArray.length
            };
        };
    }
};
