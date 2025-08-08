import React from "react";
import { useFormik, FieldArray, FormikProvider } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  inputs: Yup.array()
    .of(Yup.string().required("Field required"))
    .min(1, "At least one input required"),
  image: Yup.mixed().required("Image is required"),
});

export default function App() {
  const formik = useFormik({
    initialValues: {
      name: "",
      inputs: [""],
      image: null,
    },
    validationSchema,
    onSubmit: (values) => {
      console.log("Form Data", values);
      alert("Form submitted!");
    },
  });

  const handleImageChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      formik.setFieldValue("image", file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-xl"
      >
        <h1 className="text-2xl font-semibold text-center mb-4">Dynamic Form</h1>

        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          onChange={formik.handleChange}
          value={formik.values.name}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
        {formik.errors.name && formik.touched.name && (
          <p className="text-red-500 text-sm">{formik.errors.name}</p>
        )}

        <FormikProvider value={formik}>
          <FieldArray
            name="inputs"
            render={(arrayHelpers) => (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Input Fields
                </label>
                {formik.values.inputs.map((input, index) => (
                  <div key={index} className="flex items-center mt-2 gap-2">
                    <input
                      type="text"
                      name={`inputs[${index}]`}
                      value={formik.values.inputs[index]}
                      onChange={formik.handleChange}
                      className="flex-1 border border-gray-300 rounded-md p-2"
                    />
                    <button
                      type="button"
                      onClick={() => arrayHelpers.remove(index)}
                      className="bg-red-500 text-white px-2 py-1 rounded-md"
                      disabled={formik.values.inputs.length === 1}
                    >
                      −
                    </button>
                    <button
                      type="button"
                      onClick={() => arrayHelpers.insert(index + 1, "")}
                      className="bg-green-500 text-white px-2 py-1 rounded-md"
                    >
                      +
                    </button>
                  </div>
                ))}
                {formik.errors.inputs && typeof formik.errors.inputs === "string" && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.inputs}</p>
                )}
              </div>
            )}
          />
        </FormikProvider>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-2"
          />
          {formik.errors.image && (
            <p className="text-red-500 text-sm">{formik.errors.image}</p>
          )}
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
