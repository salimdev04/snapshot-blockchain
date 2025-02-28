const fs = require('fs');
const { Parser } = require('json2csv');
const csv = require('csvtojson');

// Function to read CSV files
async function readCSV(filePath) {
  try {
    return await csv().fromFile(filePath);
  } catch (error) {
    console.error(`Error reading CSV file ${filePath}:`, error);
    return [];
  }
}

async function main() {
  try {
    // Read both CSV files
    const holdersPhase1 = await readCSV('./holder_addresses_phase_1.csv');
    const holdersPhase2 = await readCSV('./holder_addresses_phase_2.csv');

    console.log(`Phase 1 holders: ${holdersPhase1.length}`);
    console.log(`Phase 2 holders: ${holdersPhase2.length}`);

    // Create a map to store combined points for each address
    const addressPointsMap = new Map();

    // Process Phase 1 holders
    holdersPhase1.forEach(holder => {
      const address = holder.holderAddress.toLowerCase();
      const multiplierPoints = parseFloat(holder.MULTIPLIER_POINTS || 0);
      
      addressPointsMap.set(address, {
        address: holder.holderAddress,
        phase1Points: multiplierPoints,
        phase2Points: 0,
        totalPoints: multiplierPoints
      });
    });

    // Process Phase 2 holders and add their points
    holdersPhase2.forEach(holder => {
      const address = holder.holderAddress.toLowerCase();
      const phase2Points = parseFloat(holder.TOTAL_POINTS || 0);
      
      if (addressPointsMap.has(address)) {
        // Address exists in Phase 1, add Phase 2 points
        const existingData = addressPointsMap.get(address);
        existingData.phase2Points = phase2Points;
        existingData.totalPoints = existingData.phase1Points + phase2Points;
        addressPointsMap.set(address, existingData);
      } else {
        // Address only exists in Phase 2
        addressPointsMap.set(address, {
          address: holder.holderAddress,
          phase1Points: 0,
          phase2Points: phase2Points,
          totalPoints: phase2Points
        });
      }
    });

    // Convert map to array and sort by total points (descending)
    const combinedHolders = Array.from(addressPointsMap.values())
      .sort((a, b) => b.totalPoints - a.totalPoints);

    // Add rank to each holder
    const rankedHolders = combinedHolders.map((holder, index) => ({
      RANK: index + 1,
      holderAddress: holder.address,
      PHASE_1_POINTS: holder.phase1Points,
      PHASE_2_POINTS: holder.phase2Points,
      TOTAL_POINTS: holder.totalPoints
    }));

    console.log(`Total unique holders: ${rankedHolders.length}`);

    // Define fields for CSV
    const fields = ['RANK', 'holderAddress', 'PHASE_1_POINTS', 'PHASE_2_POINTS', 'TOTAL_POINTS'];
    
    // Convert to CSV
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(rankedHolders);

    // Write to file
    fs.writeFileSync('./data/combined_holder_points.csv', csv);
    console.log('Successfully created combined_holder_points.csv');

  } catch (error) {
    console.error('Error processing data:', error);
  }
}

main();