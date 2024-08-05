"use client";
import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FaDollarSign, FaPercent } from "react-icons/fa";
import { motion } from "framer-motion";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ResultCell } from "@/components/result-cell";

// Schema definition for form validation using Zod
const formSchema = z.object({
  totalBudgetZ: z.number().min(0),
  adBudgets: z.array(z.number()),
  agencyFeePercentage: z.number().min(0),
  thirdPartyFeePercentage: z.number().min(0),
  fixedAgencyHoursCost: z.number().min(0),
});

function App() {
  // State declarations
  const [maxBudget, setMaxBudget] = useState(null);
  const [adBudgetsTotal, setAdBudgetsTotal] = useState(0);
  const [agencyFeePercentage, setAgencyFeePercentage] = useState(0);
  const [thirdPartyFeePercentage, setThirdPartyFeePercentage] = useState(0);
  const [fixedAgencyHoursCost, setFixedAgencyHoursCost] = useState(0);
  const [remainingBudget, setRemainingBudget] = useState(0);
  const [loading, setLoading] = useState(false);

  // Form setup using React Hook Form and Zod resolver
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      totalBudgetZ: 0,
      adBudgets: [0],
      agencyFeePercentage: 0,
      thirdPartyFeePercentage: 0,
      fixedAgencyHoursCost: 0,
    },
  });

  // Function to handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true); // Set loading state to true
    console.log("values", values);
    try {
      const response = await axios.post(
        "http://localhost:5241/campaign/calculate",
        {
          totalBudgetZ: values.totalBudgetZ,
          adBudgets: values.adBudgets,
          agencyFeePercentage: values.agencyFeePercentage / 100,
          thirdPartyFeePercentage: values.thirdPartyFeePercentage / 100,
          fixedAgencyHoursCost: values.fixedAgencyHoursCost,
        }
      );
      const adBudgetsTotalSpent = values.adBudgets.reduce((a, b) => a + b, 0);
      console.log("Set Ad Budgets Total:", response.data.totalBudget);

      console.log("Response Status:", response.status);
      console.log("Response Data:", response.data);

      if (response.status === 204) {
        console.log("No content returned.");
        setMaxBudget(null);
        toast.error("No content returned.");
      } else {
        console.log(
          "Max Budget For Target Ad:",
          response.data.maxBudgetForTargetAd
        );
        setAdBudgetsTotal(
          response.data.maxBudgetForTargetAd + adBudgetsTotalSpent
        );
        setRemainingBudget(response.data.remainingBudget);
        setMaxBudget(response.data.maxBudgetForTargetAd);
        setAgencyFeePercentage(form.getValues("agencyFeePercentage") / 100);
        setThirdPartyFeePercentage(
          form.getValues("thirdPartyFeePercentage") / 100
        );
        setFixedAgencyHoursCost(form.getValues("fixedAgencyHoursCost"));
        console.log("Toaster goo:");
        toast.success("Max budget calculated successfully.");
      }
    } catch (error) {
      console.error("Error calculating max budget:", error);
      console.log("Sent values:", values);
      setMaxBudget(null);
      toast.error("Error calculating max budget. .");
    } finally {
      setLoading(false); // Set loading state to false
    }
  }

  return (
    <div className="flex flex-col justify-center items-center  h-full w-full">
      <Toaster />

      <Form {...form}>
        <motion.form
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-backprimary2 top-10 absolute px-28 py-16 rounded-xl "
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-y-2"
          >
            <div className="gap-x-16 gap-y-5 grid grid-cols-2">
              <FormField
                control={form.control}
                name="totalBudgetZ"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-backprimary tracking-wider uppercase font-bold text-xs">
                      Total Campaign Budget
                    </FormLabel>
                    <FormControl>
                      <div className="flex flex-row justify-center items-center">
                        <Input
                          {...field}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            field.onChange(isNaN(value) ? 0 : value);
                          }}
                          value={field.value.toString()}
                        />
                        <FaDollarSign className="inline-block absolute border-l-2 border-turquoise pl-2 text-2xl translate-x-20 " />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="adBudgets"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-backprimary tracking-wider uppercase font-bold text-xs">
                      Ad Budget For Each Ad
                    </FormLabel>
                    <FormControl>
                      <div className="flex flex-row justify-center items-center">
                        <Input
                          {...field}
                          placeholder="Comma-separated values"
                          onChange={(e) => {
                            const values = e.target.value
                              .split(",")
                              .map((val) => parseFloat(val.trim()) || 0);

                            field.onChange(values);
                          }}
                          value={field.value.join(",")}
                        />
                        <FaDollarSign className="inline-block absolute border-l-2 border-turquoise pl-2 text-2xl translate-x-20 " />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="agencyFeePercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-backprimary tracking-wider uppercase font-bold text-xs">
                      Agency Fee Percentage
                    </FormLabel>
                    <FormControl>
                      <div className="flex flex-row justify-center items-center">
                        <Input
                          {...field}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            field.onChange(isNaN(value) ? 0 : value);
                          }}
                          value={field.value.toString()}
                        />
                        <FaPercent className="inline-block absolute border-l-2 border-turquoise pl-2 text-2xl translate-x-20 " />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="thirdPartyFeePercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-backprimary tracking-wider uppercase font-bold text-xs">
                      Third-Party Tool Fee Percentage
                    </FormLabel>
                    <FormControl>
                      <div className="flex flex-row justify-center items-center">
                        <Input
                          {...field}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            field.onChange(isNaN(value) ? 0 : value);
                          }}
                          value={field.value.toString()}
                        />
                        <FaPercent className="inline-block absolute border-l-2 border-turquoise pl-2 text-2xl translate-x-20 " />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col mt-4">
              <FormField
                control={form.control}
                name="fixedAgencyHoursCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-backprimary tracking-wider uppercase font-bold text-xs">
                      Fixed Agency Hours Cost
                    </FormLabel>
                    <FormControl>
                      <div className="flex justify-center items-center">
                        <Input
                          {...field}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            field.onChange(isNaN(value) ? 0 : value);
                          }}
                          value={field.value.toString()}
                        />
                        <FaDollarSign className="inline-block absolute translate-x-[14.6rem] border-l-2 border-turquoise pl-2 text-2xl " />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className={`mt-8 bg-gray-400 text-black hover:bg-gray-300  tracking-wider uppercase font-bold text-xs ${
                  loading && "cursor-not-allowed"
                }`}
              >
                {loading ? "Calculating..." : "Calculate"}
              </Button>
            </div>
          </motion.div>
        </motion.form>
      </Form>
      {maxBudget !== null && (
        <div
          className=" flex flex-col absolute bottom-20 bg-white py-10 px-10
        shadow-3xl
        "
        >
          <div className="text-xs pb-3 flex justify-center items-center tracking-widest font-bold text-blue-800   ">
            ESTIMATED{" "}
            <span className="text-2xl px-2 font-extrabold text-green-700 tracking-normal  ">
              ${Number(maxBudget).toFixed(2)}
            </span>{" "}
            MAX BUDGET
          </div>
          <div className="flex flex-row  border-t-2 pt-5  ">
            <ResultCell
              label="Total Ad Budget"
              value={adBudgetsTotal.toFixed(2)}
              right
            />
            <ResultCell
              label="Agency Fee"
              value={(adBudgetsTotal * agencyFeePercentage).toFixed(2)}
              right
            />
            <ResultCell
              label="Third Party Fee"
              value={(adBudgetsTotal * thirdPartyFeePercentage).toFixed(2)}
              right
            />
            <ResultCell
              label="Hourly Cost"
              value={fixedAgencyHoursCost.toFixed(2)}
              right
            />
            <ResultCell
              label="Remaining Budget"
              value={remainingBudget.toFixed(2)}
            />
          </div>
        </div>
      )}
      {loading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="rounded-full absolute top-72 "
        >
          <AiOutlineLoading3Quarters size={50} className="text-backprimary" />
        </motion.div>
      )}
    </div>
  );
}

export default App;
