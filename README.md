# tourplanner

React-based single page application, where users can collect trip ideas, filter them by distance, travel mode and weather conditions and display the results on a map.

# Features

-   login and registration
-   add destinations
    -   users can enter address or mark destination on a map
    -   travel time from home address to destination is calculated for different transport modes (Google Maps Distance Matrix API)
    -   users can set the weather conditions that are appropriate for the destination
-   overview over results
    -   results are automatically filtered according to the weather conditions (data from weather API) - users can change the day
    -   users can additionally filter the results by maximum travel time and by mode of transportion
-   detail view of destination
    -   destination is marked on a map
    -   users have the opportunity to mark a destination as a favourite
    -   other destinations (that match the current filter) are also shown an the map: by clicking on the marker the user gets detail information on these destinations

# Technology

-   React
-   Node.js
-   Express
-   PostgresSQL
-   Javascript
-   Google Maps and Weather APIs

# Preview

Login Page
<img src="/public/img/pitou_login.png" width="35%"/>

Adding new destinations: Users can enter address or mark destination on a map. The travel time to the destination is automatically calculated for different transport modes.  
<img src="/public/img/pitou_add_destination.png" width="35%"/>

Results: Overview over results with travel distance and preview of description. The results are automatically filtered according to the weather conditions.
<img src="/public/img/results.png" width="35%"/>

Filter: Users can change the day and additionally filter the results by maximum travel time and by mode of transportion.
<img src="/public/img/filter.png" width="35%"/>

Detail View
<img src="/public/img/detail_view.png" width="35%"/>
