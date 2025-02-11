// test/DonorRegistryTest.js
const { ethers } = require("hardhat");
const assert = require("assert");

describe("DonorRegistry Contract", function () {
  let DonorRegistry;
  let donorRegistry;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy the contract
    DonorRegistry = await ethers.getContractFactory("DonorRegistry");
    donorRegistry = await DonorRegistry.deploy();
    await donorRegistry.deployed();
  });

  describe("Donor Registration", function () {
    it("Should register a donor and retrieve donor details", async function () {
      const metadataCID = "QmYjwhbdh237jdsfb3";
      const maxUsage = 3;
      await donorRegistry.connect(addr1).registerDonor(metadataCID, maxUsage);

      const donor = await donorRegistry.getDonor(1);

      assert.strictEqual(donor.id.toString(), "1");
      assert.strictEqual(donor.metadataCID, metadataCID);
      assert.strictEqual(donor.usageCount.toString(), "0");
      assert.strictEqual(donor.maxUsage.toString(), maxUsage.toString());
      assert.strictEqual(donor.isActive, true);
      assert.strictEqual(donor.owner, addr1.address);
    });
  });

  describe("Donor Usage", function () {
    beforeEach(async function () {
      const metadataCID = "QmYjwhbdh237jdsfb3";
      const maxUsage = 3;
      await donorRegistry.connect(addr1).registerDonor(metadataCID, maxUsage);
    });

    it("Should increment usage count and deactivate donor after max usage", async function () {
      await donorRegistry.incrementDonorUsage(1);  
      await donorRegistry.incrementDonorUsage(1);  
      await donorRegistry.incrementDonorUsage(1);  

      const donor = await donorRegistry.getDonor(1);

      assert.strictEqual(donor.usageCount.toString(), "3"); 
      assert.strictEqual(donor.isActive, false);
    });
  });

  describe("Error Cases", function () {
    it("Should fail when trying to register a donor with an empty metadataCID", async function () {
      try {
        await donorRegistry.connect(addr1).registerDonor("", 3);
        assert.fail("Expected error not received");
      } catch (error) {
        assert(error.message.includes("Metadata CID cannot be empty"), "Expected revert reason 'Metadata CID cannot be empty'");
      }
    });

    it("Should fail when trying to increment usage for a non-existent donor", async function () {
      try {
        await donorRegistry.incrementDonorUsage(999);  // Invalid donor ID
        assert.fail("Expected error not received");
      } catch (error) {
        assert(error.message.includes("Invalid donor ID"), "Expected revert reason 'Invalid donor ID'");
      }
    });

    it("Should fail when trying to use an inactive donor", async function () {
      const metadataCID = "QmYjwhbdh237jdsfb3";
      const maxUsage = 3;
      await donorRegistry.connect(addr1).registerDonor(metadataCID, maxUsage);
      await donorRegistry.incrementDonorUsage(1);
      await donorRegistry.incrementDonorUsage(1);
      await donorRegistry.incrementDonorUsage(1); // Donor deactivated after 3 uses

      try {
        await donorRegistry.incrementDonorUsage(1);
        assert.fail("Expected error not received");
      } catch (error) {
        // Check that the error message matches the revert reason
        assert(error.message.includes("Donor is not active"), "Expected revert reason 'Donor is not active'");
      }
    });

    it("Should fail when max usage is reached", async function () {
      const metadataCID = "QmYjwhbdh237jdsfb3";
      const maxUsage = 1;
      await donorRegistry.connect(addr1).registerDonor(metadataCID, maxUsage);

      // Increment donor usage once (it should deactivate the donor)
      await donorRegistry.incrementDonorUsage(1);

      try {
        // Try using the donor again (should fail)
        await donorRegistry.incrementDonorUsage(1);
        assert.fail("Expected error not received");
      } catch (error) {
        // Check that the error message matches the revert reason
        assert(error.message.includes("Donor is not active"), "Expected revert reason 'Donor is not active'");
      }
    });
  });

  describe("Total Successful Matches", function () {
    it("Should increment total successful matches after each usage", async function () {
      // Register a donor
      const metadataCID = "QmYjwhbdh237jdsfb3";
      const maxUsage = 3;
      await donorRegistry.connect(addr1).registerDonor(metadataCID, maxUsage);

      // Get the initial total successful matches
      let totalMatches = await donorRegistry.getTotalSuccessfulMatches();
      assert.strictEqual(totalMatches.toString(), "0");

      // Increment usage for the donor
      await donorRegistry.incrementDonorUsage(1);
      totalMatches = await donorRegistry.getTotalSuccessfulMatches();
      assert.strictEqual(totalMatches.toString(), "1");

      // Increment usage again
      await donorRegistry.incrementDonorUsage(1);
      totalMatches = await donorRegistry.getTotalSuccessfulMatches();
      assert.strictEqual(totalMatches.toString(), "2");
    });
  });
});
