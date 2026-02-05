import React, { useState } from "react";
import "./owner.css";

export default function MessForm() {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    messName: "",
    ownerName: "",
    locality: "",
    contact: "",
    foodType: "",
    price: "",
    meals: {
      breakfast: false,
      lunch: false,
      dinner: false,
    },
    serviceType: "",
    description: "",
    deliveryService: "",
    tiffinService: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        meals: {
          ...prev.meals,
          [name]: checked,
        },
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("FINAL JSON:", JSON.stringify(formData, null, 2));
    alert("Check console for your JSON");
  };

  return (
    <div className="page">
      {/* STEP UI */}
      <div className="steps">
        <div className={`step ${step >= 1 ? "active" : ""}`}>1</div>
        <div className={`step ${step >= 2 ? "active" : ""}`}>2</div>
        <div className={`step ${step >= 3 ? "active" : ""}`}>3</div>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        {/* STEP 1 */}
        {step === 1 && (
          <section className="card">
            <h2>Basic Details</h2>

            <input
              name="messName"
              placeholder="Mess Name"
              value={formData.messName}
              onChange={handleChange}
            />
            <input
              name="ownerName"
              placeholder="Owner Name"
              value={formData.ownerName}
              onChange={handleChange}
            />
            <input
              name="locality"
              placeholder="Locality / Area"
              value={formData.locality}
              onChange={handleChange}
            />
            <input
              name="contact"
              placeholder="Contact No"
              value={formData.contact}
              onChange={handleChange}
            />

            <div className="radio-row">
              {["Veg", "Non-Veg", "Both"].map((f) => (
                <label key={f}>
                  <input
                    type="radio"
                    name="foodType"
                    value={f}
                    checked={formData.foodType === f}
                    onChange={handleChange}
                  />{" "}
                  {f}
                </label>
              ))}
            </div>

            <button type="button" className="submit" onClick={nextStep}>
              Next →
            </button>
          </section>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <section className="card">
            <h2> Preferences</h2>

            <input
              name="price"
              placeholder="Monthly Pricing"
              value={formData.price}
              onChange={handleChange}
            />

            <div className="radio-col">
              <label>
                <input
                  type="checkbox"
                  name="breakfast"
                  checked={formData.meals.breakfast}
                  onChange={handleChange}
                />{" "}
                Breakfast
              </label>
              <label>
                <input
                  type="checkbox"
                  name="lunch"
                  checked={formData.meals.lunch}
                  onChange={handleChange}
                />{" "}
                Lunch
              </label>
              <label>
                <input
                  type="checkbox"
                  name="dinner"
                  checked={formData.meals.dinner}
                  onChange={handleChange}
                />{" "}
                Dinner
              </label>
           

{/* UPLOAD PHOTOS */}
<label className="upload">
  Upload Photos (Optional)
  <input
    type="file"
    multiple
    hidden
    onChange={(e) => {
      console.log(e.target.files); // later you can send this to backend
    }}
  />
</label>
 </div>

            <div className="btn-row">
              <button type="button" className="submit" onClick={prevStep}>
                ← Back
              </button>
              <button type="button" className="submit" onClick={nextStep}>
                Next →
              </button>
            </div>
          </section>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <section className="card">
            <h2>Services & Availability</h2>

            <h4>What do you provide?</h4>
            <div className="radio-col">
              {["Meals", "Snacks", "Both"].map((s) => (
                <label key={s}>
                  <input
                    type="radio"
                    name="serviceType"
                    value={s}
                    checked={formData.serviceType === s}
                    onChange={handleChange}
                  />{" "}
                  {s}
                </label>
              ))}
            </div>

            <h4>Description</h4>
            <textarea
              className="big-textarea"
              name="description"
              placeholder="Describe your mess, food quality, hygiene, special items, timings..."
              value={formData.description}
              onChange={handleChange}
            />

            <h4>Delivery Service?</h4>
            <div className="radio-col">
              {["Yes", "No"].map((d) => (
                <label key={d}>
                  <input
                    type="radio"
                    name="deliveryService"
                    value={d}
                    checked={formData.deliveryService === d}
                    onChange={handleChange}
                  />{" "}
                  {d}
                </label>
              ))}
            </div>

            <h4>Tiffin Service?</h4>
            <div className="radio-col">
              {["Yes", "No"].map((t) => (
                <label key={t}>
                  <input
                    type="radio"
                    name="tiffinService"
                    value={t}
                    checked={formData.tiffinService === t}
                    onChange={handleChange}
                  />{" "}
                  {t}
                </label>
              ))}
            </div>

            <div className="btn-row">
              <button type="button" className="submit" onClick={prevStep}>
                ← Back
              </button>
              <button className="submit">Submit For Verification</button>
            </div>
          </section>
        )}
      </form>
    </div>
  );
}
