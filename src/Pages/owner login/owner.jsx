import React from "react";
import "./owner.css";

export default function MessForm() {
  return (
    <div className="page">

      {/* HEADER SECTION */}
      <div className="header">
        <h1>List Your Mess</h1>
        <p className="subtitle">
          Reach more students. Manage menus easily. Get verified.
        </p>
      </div>

      <form className="form">

        {/* BASIC DETAILS */}
        <section className="card">
          <h2>Basic Details</h2>

          <input type="text" placeholder="Mess Name" />
          <input type="text" placeholder="Owner Name" />
          <input type="text" placeholder="Locality / Area" />
          <input type="text" placeholder="Contact No" />

          <div className="radio-row">
            <label>
              <input type="radio" name="food" /> Veg
            </label>
            <label>
              <input type="radio" name="food" /> Non-Veg
            </label>
            <label>
              <input type="radio" name="food" /> Both
            </label>
          </div>
        </section>

        {/* FOOD & PRICING */}
        <section className="card">
          <h2>Food & Pricing Details</h2>

          <input type="text" placeholder="Monthly Pricing" />

          <div className="radio-col">
            <label>
              <input type="checkbox" /> Breakfast
            </label>
            <label>
              <input type="checkbox" /> Lunch
            </label>
            <label>
              <input type="checkbox" /> Dinner
            </label>
          </div>

          <label className="upload">
            Upload Photos (Optional)
            <input type="file" multiple hidden />
          </label>
        </section>

        {/* HYGIENE & AVAILABILITY */}
        <section className="card">
          <h2>Hygiene & Availability</h2>

          <h4>Kitchen Type</h4>
          <div className="radio-col">
            <label>
              <input type="radio" name="kitchen" /> Home Kitchen
            </label>
            <label>
              <input type="radio" name="kitchen" /> Commercial Kitchen
            </label>
          </div>

          <h4>Cleanliness Commitment</h4>
          <div className="radio-col">
            <label>
              <input type="radio" name="clean" /> Daily Cleaning
            </label>
            <label>
              <input type="radio" name="clean" /> Weekly Cleaning
            </label>
          </div>

          <h4>Available Days</h4>
          <div className="days">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <label key={d}>
                <input type="checkbox" /> {d}
              </label>
            ))}
          </div>
        </section>

        {/* INFO */}
        <section className="card info">
          🔒 Your details are safe  
          <br />
          ⏱ Verification within 24–48 hrs  
          <br />
          ✅ Only verified messes go live
        </section>

        {/* FINAL SUBMIT */}
        <button className="submit">Submit For Verification</button>
      </form>
    </div>
  );
}
