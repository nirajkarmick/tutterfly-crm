export class Itinerary {

   "name": string;
    "description":string;
    "number_of_travellers":any;
    "number_of_adults":any;
    "number_of_childrens":any;
    "number_of_days":number;
    "start_date":string;
    "end_date":string;
    "timezone":any;
    "amount" :any;
    //"destination_id":any[];
    "destination_id":any;
    "banner_image":File | null;
    "date_or_days":any;
    "status":any;
    "day_destinations":any[]; 
    

}
export class CopyItinerary {

   "name": string;
    "itinerary_id" : any;
    "description":string;
    "number_of_days":number;
    "itinerary_days":any;
    "destination_id":any;
    "banner_image":File | null;
    "status":any;
    "day_ids":any;
    

}
export class Inclusion{
    "id":any;
    "itinerary_id" : any;
    "itinerary_inclusions_id" : any;
    "inclusion_description" : any;
    "exclusion_description" : any;
    "user_itinerary_inclusion_id":any;
    "user_inclusions_lists" :any;

}
 
export class Flights{
"id":any;
    "itinerary_id" : any;
    
      "departure_title":any;
        "dep_fight_name":any;
        "dep_fight_number":any;
        "from_airport_name":any;
        "from_poi_name":any;
        "from_city_id":any;
        "from_state_id":any;
        "from_country":any;
        "from_place_id":any;
        "from_latitude":any;
        "from_longitude":any;
        "from_address":any;
        "to_fight_name":any;
        "to_fight_number":any;
        "to_airport_name":any;
        "to_poi_name":any;
        "to_city_id":any;
        "to_state_id":any;
        "to_country":any;
        "to_place_id":any;
        "to_latitude":any;
        "to_longitude":any;
        "to_address":any;
            "arrival_title":any;
            "arr_fight_name":any;
            "arr_fight_number":any;
            "arr_from_airport_name":any;
            "arr_from_poi_name":any;
            "arr_from_city_id":any;
            "arr_from_state_id":any;
            "arr_from_country":any;
            "arr_from_place_id":any;
            "arr_from_latitude":any;
            "arr_from_longitude":any;
            "arr_from_address":any;
            "arr_to_fight_name":any;
            "arr_to_fight_number":any;
            "arr_to_airport_name":any;
            "arr_to_poi_name":any;
            "arr_to_city_id":any;
            "arr_to_state_id":any;
            "arr_to_country":any;
            "arr_to_place_id":any;
            "arr_to_latitude":any;
            "arr_to_longitude":any;
            "arr_to_address":any;
}

