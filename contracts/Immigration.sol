// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

import "./Citizen.sol";
import "./Flight.sol";
import "./Country.sol";

contract Immigration is Citizen, Flight, Country {
    mapping(uint256 => uint256[]) passengersInFlight;

    // citizen functions
    function createCitizen(
        uint256 id,
        string memory pn,
        string memory nam,
        string memory dateOfBirth,
        string memory nation
    ) public {
        Citizen.setCitizen(id, pn, nam, dateOfBirth, nation);
    }

    // flight functions
    function createNewFlight(
        uint256 id,
        string memory code,
        string memory name,
        string memory op,
        string memory dep_con,
        string memory arr_con
    ) public {
        Flight.setFlight(id, code, name, op, dep_con, arr_con);
    }

    function checkIllegalTravel(uint256 citizen_id, uint256 flight_id)
        public
        view
    {
        require(
            keccak256(abi.encodePacked(Flight.getFlightDeparture(flight_id))) ==
                keccak256(
                    abi.encodePacked(Citizen.getLastKnownLocation(citizen_id))
                ),
            "Illegal Travel"
        );
    }

    function clearDepartureImmigration(
        uint256 citizen_id,
        uint256 flight_id,
        string memory country_name
    ) public returns (string memory) {
        // if departure country has whitelisted the last known location, then no need to check it
        if (
            !Country.checkWhiteListCountry(
                Flight.getFlightDeparture(flight_id),
                Citizen.getLastKnownLocation(citizen_id)
            )
        ) checkIllegalTravel(citizen_id, flight_id);

        // check if country is blacklisted or graylisted
        (bool country_result, uint256 list_num) = Country.checkListCountry(
            citizen_id
        );
        if (country_result == false) {
            if (list_num == 1) return "failure";
            else if (list_num == 2) return "warning";
        }

        // check if citizen is blacklisted or graylisted
        (bool citizen_result, uint256 list_n) = Country.checkListCitizen(
            citizen_id
        );
        if (citizen_result == false) {
            if (list_num == 1) return "failure";
            else if (list_num == 2) return "warning";
        }

        // allow to board if no problems
        addPersonToFlight(citizen_id, flight_id);
    }

    function addPersonToFlight(uint256 citizen_id, uint256 flight_id) public {
        passengersInFlight[flight_id].push(citizen_id);

        Citizen.setLastKnownLocation(
            citizen_id,
            Flight.getFlightDeparture(flight_id),
            "Departure"
        );
        Citizen.setCitizenArrival(
            citizen_id,
            Flight.getFlightArrival(flight_id)
        );
    }

    function clearArrivalImmigration(
        uint256 citizen_id,
        uint256 flight_id,
        string memory country_name
    ) public returns (string memory) {
        // // if arrival country has whitelisted the last known location, then no need to check it
        // if (
        //     !Country.checkWhiteListCountry(
        //         Flight.getFlightDeparture(flight_id),
        //         Citizen.getLastKnownLocation(citizen_id)
        //     )
        // ) checkIllegalTravel(citizen_id, flight_id);

        // check if country is blacklisted or graylisted
        (bool country_result, uint256 list_num) = Country.checkListCountry(
            citizen_id
        );
        if (country_result == false) {
            if (list_num == 1) return "failure";
            else if (list_num == 2) return "warning";
        }

        // check if citizen is blacklisted or graylisted
        (bool citizen_result, uint256 list_n) = Country.checkListCitizen(
            citizen_id
        );
        if (citizen_result == false) {
            if (list_num == 1) return "failure";
            else if (list_num == 2) return "warning";
        }

        // allow to board if no problems
        allowToEnterCountry(citizen_id, flight_id);
    }

    function allowToEnterCountry(uint256 citizen_id, uint256 flight_id) public {
        Flight.flight memory f = Flight.getFlight(flight_id);

        require(
            keccak256(abi.encodePacked(Flight.getFlightArrival(flight_id))) ==
                keccak256(
                    abi.encodePacked(Citizen.getCitizenArrival(citizen_id))
                ),
            "Illegal Travel"
        );

        Citizen.setLastKnownLocation(
            citizen_id,
            f.arrival_airport_code,
            "Arrival"
        );
        Citizen.setCitizenArrival(citizen_id, "");
    }

    function emergency_landing(uint256 citizen_id, uint256 flight_id) public {
        Flight.flight memory f = Flight.getFlight(flight_id);

        Citizen.setLastKnownLocation(
            citizen_id,
            f.arrival_airport_code,
            "Emergency"
        );
    }
}
