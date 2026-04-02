// src/utils/geoFlow.js
import { KARNATAKA_RIVERS } from '../data/karnatakaRivers';

// Haversine formula to mathematically calculate distance between two coordinates in kilometers.
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth Radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; 
};

/**
 * Predictive Downstream Contamination Engine
 * Takes a waste report coordinate, snaps it to the nearest topographical river node,
 * and extracts the path downstream down to the mouth/ocean.
 * 
 * @param {number} reportLat 
 * @param {number} reportLng 
 * @param {number} thresholdKm - The maximum distance a report can be from a river to be considered "contaminating" it.
 * @returns {object|null} - Contains the river name, risk level, and the downstream polyline coordinates.
 */
export const getDownstreamRiskPath = (reportLat, reportLng, thresholdKm = 15) => {
    let closestRiver = null;
    let closestNodeIndex = -1;
    let minDistance = Infinity;

    // 1. Scan all river systems in the state
    KARNATAKA_RIVERS.forEach(river => {
        river.coords.forEach((coord, idx) => {
            const dist = calculateDistance(reportLat, reportLng, coord[0], coord[1]);
            if (dist < minDistance) {
                minDistance = dist;
                closestRiver = river;
                closestNodeIndex = idx;
            }
        });
    });

    // 2. If the user report is mathematically too far from any recorded water body, it is a localized land threat.
    if (minDistance > thresholdKm || !closestRiver) {
        return null; 
    }

    // 3. SNAPPING AND SLICING LOGIC
    // The river coordinates are ordered 0 = Source -> N = Ocean/Mouth.
    // Therefore, any contamination entering at closestNodeIndex will flow from that index onwards.
    const downstreamPath = closestRiver.coords.slice(closestNodeIndex);

    return {
        riverName: closestRiver.name,
        destination: closestRiver.destination,
        distanceToRiver: minDistance.toFixed(2),
        downstreamNodes: downstreamPath.length,
        riskPath: downstreamPath // Array of [lat, lng] to trigger turning red on the map.
    };
};
