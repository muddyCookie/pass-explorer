// Starter Six Flags catalog.
// Add parks and pass pricing here as you rebuild the site.

const parkCatalog = {
  "Six Flags": Object.fromEntries(
    ["Six Flags East", "Six Flags Midwest", "Six Flags Texas", "Six Flags West"]
      .map((group) => [group, []])
  )
};

for (const [company, companyConfig] of Object.entries(parkData)) {
  for (const [group, regionConfig] of Object.entries(companyConfig || {})) {
    for (const portalConfig of Object.values(regionConfig || {})) {
      if (!parkCatalog[company]) {
        parkCatalog[company] = {};
      }
      if (!parkCatalog[company][group]) {
        parkCatalog[company][group] = [];
      }

      for (const park of portalConfig.parks || []) {
        parkCatalog[company][group].push({
          park: park.park,
          slug: park.slug,
          state: park.state,
          country: park.country,
          parkType: Array.isArray(park.parkType) ? park.parkType : [],
          currency: park.currency,
          passes: {
            ...(park.passes || {}),
            ...(park.memberships || {})
          }
        });
      }
    }
  }
}
