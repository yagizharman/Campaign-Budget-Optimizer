using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using Microsoft.Extensions.Logging;

namespace CampaignMediaPlanning.Controllers
{
    // Defines a controller for handling campaign-related API requests
    [ApiController]
    [Route("[controller]")]
    public class CampaignController : ControllerBase
    {
        private readonly ILogger<CampaignController> _logger;

        // Constructor that accepts a logger to log information, warnings, or errors
        public CampaignController(ILogger<CampaignController> logger)
        {
            _logger = logger;
        }

        // HTTP POST endpoint for calculating the maximum budget for a target ad
        [HttpPost]
        [Route("calculate")]
        public IActionResult Calculate([FromBody] CampaignRequest request)
        {
            try
            {
                // Calculate the maximum budget for the target ad using the GoalSeek method
                double maxBudgetForTargetAd = GoalSeek(
                    request.TotalBudgetZ,
                    request.AdBudgets,
                    request.AgencyFeePercentage,
                    request.ThirdPartyFeePercentage,
                    request.FixedAgencyHoursCost);

                // Calculate the total ad spend, total budget, and remaining budget
                double totalAdSpend = maxBudgetForTargetAd + request.AdBudgets.Sum();
                double totalBudget = totalAdSpend + request.AgencyFeePercentage * totalAdSpend +
                                     request.ThirdPartyFeePercentage * totalAdSpend +
                                     request.FixedAgencyHoursCost;
                double remainingBudget = request.TotalBudgetZ - totalBudget;

                // Return the calculated values as a JSON response
                return Ok(new
                {
                    MaxBudgetForTargetAd = maxBudgetForTargetAd,
                    TotalBudget = totalBudget,
                    RemainingBudget = remainingBudget
                });
            }
            catch (Exception ex)
            {
                // Log an error if an exception occurs and return a 500 status code
                _logger.LogError(ex, "Error in Calculate method");
                return StatusCode(500, "Internal server error");
            }
        }

        // Goal-seeking algorithm to find the maximum budget for the target ad
        double GoalSeek(double totalBudgetZ, double[] adBudgets, double y1, double y2, double hours)
        {
            double targetAdBudget = 0;
            double increment = 1.0;  // Start with a larger increment
            double epsilon = 0.01;   // Acceptable error margin
            int maxIterations = 100000;  // Maximum number of iterations allowed
            int iterations = 0;  // Counter for the number of iterations

            double lastValidBudget = 0;

            while (iterations < maxIterations)
            {
                // Calculate the total budget for the current target ad budget
                double calculatedBudget = CalculateTotalBudget(targetAdBudget, adBudgets, y1, y2, hours);

                // Check if the calculated budget is close enough to the total budget
                if (Math.Abs(calculatedBudget - totalBudgetZ) < epsilon)
                {
                    _logger.LogInformation("GoalSeek converged after {iterations} iterations", iterations);
                    _logger.LogInformation("targetAdBudget={targetAdBudget}, calculatedBudget={calculatedBudget}", targetAdBudget, calculatedBudget);
                    return lastValidBudget;  // Return the last valid budget if convergence is achieved
                }

                // Adjust the target ad budget based on the calculated budget
                if (calculatedBudget > totalBudgetZ)
                {
                    increment /= 2;  // Decrease the increment if the budget exceeds the total budget
                    targetAdBudget -= increment;
                }
                else
                {
                    lastValidBudget = targetAdBudget;
                    targetAdBudget += increment;  // Increase the increment if the budget is below the total budget
                }

                // Ensure the target ad budget does not go below zero
                if (targetAdBudget < 0)
                {
                    targetAdBudget = 0;
                    break;
                }

                iterations++;  // Increment the iteration counter
                _logger.LogInformation("Iteration {iterations}: targetAdBudget={targetAdBudget}, calculatedBudget={calculatedBudget}", iterations, targetAdBudget, calculatedBudget);
            }

            // If the algorithm does not converge, log an error and throw an exception
            _logger.LogError("GoalSeek did not converge after {maxIterations} iterations", maxIterations);
            _logger.LogInformation("Returning last valid budget before crossing the limit: {lastValidBudget}", lastValidBudget);
            throw new InvalidOperationException("GoalSeek did not converge after maximum iterations");
        }

        // Helper method to calculate the total budget based on various parameters
        double CalculateTotalBudget(double targetAdBudget, double[] adBudgets, double y1, double y2, double hours)
        {
            double totalAdSpend = targetAdBudget + adBudgets.Sum();
            double totalBudget = totalAdSpend + y1 * totalAdSpend + y2 * totalAdSpend + hours;

            return totalBudget;
        }
    }

    // Data transfer object representing the request payload for the campaign calculation
    public class CampaignRequest
    {
        public double TotalBudgetZ { get; set; }  // Total campaign budget
        public double[] AdBudgets { get; set; }  // Array of individual ad budgets
        public double AgencyFeePercentage { get; set; }  // Percentage fee charged by the agency
        public double ThirdPartyFeePercentage { get; set; }  // Percentage fee for third-party tools
        public double FixedAgencyHoursCost { get; set; }  // Fixed cost for agency hours
    }
}
