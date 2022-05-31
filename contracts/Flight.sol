// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

contract Flight {
    struct flight {
        uint256 id;
        string code;
        string name;
        string operator;
        string departure_airport_code;
        string arrival_airport_code;
    }

    mapping(uint256 => flight) planeHashMap;

    function getFlight(uint256 id) public view returns (Flight.flight memory) {
        require(planeHashMap[id].id == id, "Flight does not exist");
        return planeHashMap[id];
    }

    function setFlight(
        uint256 flight_id,
        string memory code,
        string memory flight_name,
        string memory operator,
        string memory departure_airport_code,
        string memory arrival_airport_code
    ) internal {
        require(
            planeHashMap[flight_id].id != flight_id,
            "Flight already exists"
        );
        planeHashMap[flight_id] = Flight.flight(
            flight_id,
            code,
            flight_name,
            operator,
            departure_airport_code,
            arrival_airport_code
        );
    }

    function getFlightDeparture(uint256 id)
        public
        view
        returns (string memory)
    {
        Flight.flight memory p = planeHashMap[id];
        require(p.id == id, "Flight does not exists");
        return p.departure_airport_code;
    }

    function getFlightArrival(uint256 id)
        public
        view
        returns (string memory)
    {
        Flight.flight memory p = planeHashMap[id];
        require(p.id == id, "Flight does not exists");
        return p.arrival_airport_code;
    }
}
