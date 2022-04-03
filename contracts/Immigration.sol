// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Immigration {

    // security
    address creator;
    modifier onlyCreator() {
        require(msg.sender == creator);
        _;                             
    } 

    //data structure & variables
    struct Citizen{
        uint id;
        string passport_number;
        string name;
        string dob;
        string last_known_location;
        string nationality;
    }
    struct Flight {
        uint id;
        string code; 
        string name;
        string operator;
        string departure_airport_code;
        string arrival_airport_code;
    }
    mapping(uint => Citizen) citizenHashMap;
    mapping(uint => Flight) planeHashMap;
    mapping(uint => Citizen[]) passengersInFlight;
    
    // citizen functions
    function createNewCitizen(uint id, string memory pn, string memory nam, string memory dateOfBirth, string memory nation) public{
        require(citizenHashMap[id].id!=id, "Citizen already exists");
        citizenHashMap[id] = Citizen(id, pn, nam, dateOfBirth, nation, nation);
    }

    function changeLastKnownLocation(uint id, string memory lkl) private {
        Citizen memory p = citizenHashMap[id];
        require(p.id==id, "Citizen does not exists");
        citizenHashMap[id].last_known_location = lkl;
    }

    function getLastKnownLocation(uint id) public view returns (string memory) {
        Citizen memory p = citizenHashMap[id];
        require(p.id == id, "Citizen does not exists");
        return p.last_known_location;
    }

    // flight functions
    function createNewFlight(uint flight_id, string memory code, string memory flight_name, string memory operator, string memory departure_airport_code, string memory arrival_airport_code) public{
        require(planeHashMap[flight_id].id!=flight_id, "Flight already exists");
        planeHashMap[flight_id] = Flight(flight_id, code, flight_name, operator, departure_airport_code, arrival_airport_code);
    }

    function getFlightDeparture(uint id) public view returns (string memory) {
        Flight memory p = planeHashMap[id];
        require(p.id==id, "Flight does not exists");
        return p.departure_airport_code;
    }

    function checkIllegalTravel(uint citizen_id, uint flight_id) public view{
        require(
                keccak256(abi.encodePacked(getFlightDeparture(flight_id)))
                == 
                keccak256(abi.encodePacked(getLastKnownLocation(citizen_id))),
            "Illegal Travel"
        );
    }

    function addPersonToFlight(uint citizen_id, uint flight_id) public{
        Citizen memory c = citizenHashMap[citizen_id];
        require(c.id==citizen_id, "Citizen does not exists");
        Flight memory f = planeHashMap[flight_id];
        require(f.id==flight_id, "Flight does not exists");

        checkIllegalTravel(citizen_id, flight_id);

        passengersInFlight[flight_id].push(c);

        changeLastKnownLocation(citizen_id, planeHashMap[flight_id].arrival_airport_code);
    }
}