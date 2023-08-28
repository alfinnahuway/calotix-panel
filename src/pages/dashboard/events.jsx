import {
  CardBody,
  Typography,
  Button,
  Card,
  CardHeader,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Select,
  Option,
  Textarea,
  IconButton,
  Tooltip,
  Alert,
  CardFooter,
} from "@material-tailwind/react";
import { PlusIcon, EyeIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  PencilIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";
import validator from "validator";

const Events = () => {
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [active, setActive] = useState(1);
  const [formData, setFormData] = useState({
    headline: "",
    artistName: "",
    regionId: "",
    venue: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    poster: null,
    description: "",
  });
  const [totalPage, setTotalPage] = useState(1);
  const pagination = Math.ceil(totalPage / 10);
  const [validationErrors, setValidationErrors] = useState({
    headline: "",
    artistName: "",
    regionId: "",
    venue: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    poster: null,
    description: "",
  });
  const [regions, setRegions] = useState([]);

  const validateFormData = (formData) => {
    const {
      headline,
      artistName,
      regionId,
      venue,
      startDate,
      startTime,
      endTime,
      poster,
    } = formData;

    const newValidationErrors = {
      headline: validator.isLength(headline, { min: 1 }),
      artistName: validator.isLength(artistName, { min: 1 }),
      regionId: validator.isInt(regionId),
      venue: validator.isLength(venue, { min: 1 }),
      startDate: validator.isDate(startDate),
      startTime: validator.isLength(startTime, { min: 1 }),
      endTime: validator.isLength(endTime, { min: 1 }),
      poster: !!poster,
    };

    setValidationErrors(newValidationErrors);

    return newValidationErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      poster: file,
    }));
  };

  const getAllEvent = async (page) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/events/fetch?page=${page}`
      );
      setEvents(response.data.data);
      setTotalPage(response.data.totalrow);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllEvent(active);
  }, [active]);

  const getAllRegion = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/regions/fetch"
      );
      setRegions(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllRegion();
  }, []);

  const handleSubmit = async () => {
    const validResult = validateFormData(formData);

    if (Object.values(validResult).some((item) => !item)) {
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/events/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setOpen(!open);
      setShowAlert(true);
      getAllEvent(active);
    }
  };

  const handleOpen = () => {
    setFormData({
      headline: "",
      artistName: "",
      regionId: "",
      venue: "",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      poster: null,
      description: "",
    });
    setValidationErrors({
      headline: "",
      artistName: "",
      regionId: "",
      venue: "",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      poster: "",
      description: "",
    });
    setOpen(!open);
  };

  const getItemProps = (index) => ({
    variant: active === index ? "filled" : "text",
    color: "gray",
    onClick: () => setActive(index),
  });

  const next = () => {
    if (active === pagination) return;
    setActive(active + 1);
  };

  const prev = () => {
    if (active === 1) return;

    setActive(active - 1);
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="orange" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Events
          </Typography>
        </CardHeader>
        <CardBody>
          <Alert
            show={showAlert}
            icon={<CheckCircleIcon strokeWidth={2} className="h-6 w-6" />}
            className="rounded-none border-l-4 border-[#2ec946] bg-[#2ec946]/10 font-medium text-[#2ec946]"
            dismissible={{
              onClose: () => setShowAlert(false),
            }}
          >
            Event success added
          </Alert>
        </CardBody>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <div className="ml-4 w-32">
            <Button
              onClick={handleOpen}
              size="sm"
              className="flex w-full items-center justify-between"
              color="orange"
            >
              <PlusIcon strokeWidth={2.5} className="h-5 w-5" /> Add Event
            </Button>

            <Dialog open={open} handler={handleOpen} size="md">
              <DialogHeader>Add Event</DialogHeader>

              <DialogBody className="grid grid-cols-2  gap-4" divider>
                <div className="col-span-2">
                  <Input
                    type="text"
                    label="Headline"
                    name="headline"
                    value={formData.headline}
                    onChange={(e) => handleInputChange(e)}
                    error={validationErrors.headline === false}
                  />
                  {validationErrors.headline === false && (
                    <p className="-mb-3 p-1 text-xs text-red-500">
                      Headline is required
                    </p>
                  )}
                </div>
                <div className="flex w-full flex-col gap-5">
                  <div>
                    <Input
                      type="text"
                      label="Artis Name"
                      name="artistName"
                      value={formData.artistName}
                      onChange={(e) => handleInputChange(e)}
                      error={validationErrors.artistName === false}
                    />
                    {validationErrors.artistName === false && (
                      <p className="-mb-3 p-1 text-xs text-red-500">
                        Artist Name is required
                      </p>
                    )}
                  </div>
                  <div>
                    <Input
                      type="text"
                      label="Venue"
                      name="venue"
                      value={formData.venue}
                      onChange={(e) => handleInputChange(e)}
                      error={validationErrors.venue === false}
                    />
                    {validationErrors.venue === false && (
                      <p className="-mb-3 p-1 text-xs text-red-500">
                        Venue is required
                      </p>
                    )}
                  </div>
                  <div>
                    <Input
                      type="date"
                      label="Start Date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange(e)}
                      error={validationErrors.startDate === false}
                    />
                    {validationErrors.startDate === false && (
                      <p className="-mb-3 p-1 text-xs text-red-500">
                        Start Date is required
                      </p>
                    )}
                  </div>
                  <div>
                    <Input
                      type="time"
                      label="Start Time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={(e) => handleInputChange(e)}
                      error={validationErrors.startTime === false}
                    />
                    {validationErrors.startTime === false && (
                      <p className="-mb-3 p-1 text-xs text-red-500">
                        Start Time is required
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex w-full flex-col gap-5">
                  <div>
                    <Select
                      label="Select Region"
                      name="regionId"
                      value={formData.regionId}
                      onChange={(val) =>
                        setFormData((prevData) => ({
                          ...prevData,
                          regionId: val,
                        }))
                      }
                      error={validationErrors.regionId === false}
                    >
                      {regions?.map((items) => (
                        <Option key={items.id} value={`${items.id}`}>
                          {items?.region_city}
                        </Option>
                      ))}
                    </Select>
                    {validationErrors.startTime === false && (
                      <p className="-mb-3 p-1 text-xs text-red-500">
                        Please select region
                      </p>
                    )}
                  </div>
                  <div>
                    <Input
                      type="file"
                      label="Poster"
                      name="poster"
                      onChange={(e) => handleFileChange(e)}
                      accept="image/*"
                      error={validationErrors.poster === false}
                    />
                    {validationErrors.poster === false && (
                      <p className="-mb-3 p-1 text-xs text-red-500">
                        Poster is required
                      </p>
                    )}
                  </div>

                  <Input
                    type="date"
                    label="End Date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange(e)}
                    min={formData.startDate}
                  />
                  <div>
                    <Input
                      type="time"
                      label="End Time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={(e) => handleInputChange(e)}
                      min={formData.startTime}
                      error={validationErrors.endTime === false}
                    />
                    {validationErrors.endTime === false && (
                      <p className="-mb-3 p-1 text-xs text-red-500">
                        End Time is required
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-span-2">
                  <Textarea
                    name="description"
                    label="Description"
                    value={formData.description}
                    onChange={(e) => handleInputChange(e)}
                  />
                </div>
              </DialogBody>

              <DialogFooter>
                <Button
                  variant="text"
                  color="red"
                  onClick={handleOpen}
                  className="mr-1"
                >
                  <span>Cancel</span>
                </Button>
                <Button variant="gradient" color="green" onClick={handleSubmit}>
                  <span>Confirm</span>
                </Button>
              </DialogFooter>
            </Dialog>
          </div>
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["No.", "poster", "headline", "veneu", "times", "", ""].map(
                  (el, i) => (
                    <th
                      key={i}
                      className="border-b border-blue-gray-50 py-3 px-5 text-left"
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-bold uppercase text-blue-gray-400"
                      >
                        {el}
                      </Typography>
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {events.map(
                (
                  {
                    id,
                    poster,
                    headline,
                    regions,
                    venue,
                    start_time,
                    end_time,
                  },
                  indexRow
                ) => {
                  const className = `py-3 px-4 ${
                    id === events.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  const numRows = (active - 1) * 10 + indexRow + 1;
                  return (
                    <tr key={id}>
                      <td className="w-5 text-center">{numRows}</td>
                      <td className={`${className} w-64`}>
                        <div className="flex h-[100px] w-[200px] items-center">
                          {poster && (
                            <img
                              className="h-full w-full"
                              src={`http://localhost:8080/uploads/poster/${poster}`}
                              alt={headline}
                            />
                          )}
                        </div>
                      </td>
                      <td className={className}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-semibold"
                        >
                          {headline}
                        </Typography>
                        <Typography className="text-xs font-normal text-blue-gray-500">
                          {regions?.region_city}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {venue}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {start_time + " - " + end_time}
                        </Typography>
                      </td>
                      <td className="w-8">
                        <Tooltip content="Edit Events">
                          <Link>
                            <IconButton color="orange" size="sm">
                              <PencilIcon className="h-4 w-4" />
                            </IconButton>
                          </Link>
                        </Tooltip>
                      </td>
                      <td className="w-12">
                        <Tooltip content="Show Details Events">
                          <Link to={`/dashboard/events/detail-event/${id}`}>
                            <IconButton className="" size="sm">
                              <EyeIcon className="h-4 w-4" />
                            </IconButton>
                          </Link>
                        </Tooltip>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </CardBody>
        <CardFooter>
          <div className="flex items-center gap-4">
            <Button
              variant="text"
              className="flex items-center gap-2"
              onClick={prev}
              disabled={active === 1}
            >
              <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Previous
            </Button>
            <div className="flex items-center gap-2">
              {Array.from({ length: pagination }, (_, index) => (
                <IconButton key={index + 1} {...getItemProps(index + 1)}>
                  {index + 1}
                </IconButton>
              ))}
            </div>
            <Button
              variant="text"
              className="flex items-center gap-2"
              onClick={next}
              disabled={active === pagination}
            >
              Next
              <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Events;
