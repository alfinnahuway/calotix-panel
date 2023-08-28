import { PencilIcon, PlusIcon, EyeIcon } from "@heroicons/react/24/solid";
import {
  CardBody,
  Typography,
  Button,
  Card,
  CardHeader,
  Input,
  DialogFooter,
  DialogHeader,
  DialogBody,
  Dialog,
  Tooltip,
  IconButton,
} from "@material-tailwind/react";
import axios from "axios";
import moment from "moment/moment";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import validator from "validator";

const DetailEvent = () => {
  const { eventId } = useParams();
  const [detailEvent, setDetailEvent] = useState({});
  const [open, setOpen] = useState(false);
  const [ticketData, setTicketData] = useState({
    eventId: eventId,
    category: "",
    qty: "",
    price: "",
  });
  const [validationErrors, setValidationErrors] = useState({
    category: "",
    qty: "",
    price: "",
  });
  const validateFormData = (ticketing) => {
    const { category, qty, price } = ticketing;

    const newValidationErrors = {
      category: validator.isLength(category, { min: 1 }),
      qty: validator.isInt(qty, { min: 1 }),
      price: validator.isInt(price, { min: 1 }),
    };

    setValidationErrors(newValidationErrors);

    return newValidationErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTicketData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const getDetailEvent = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/events/detail/${eventId}`
      );

      setDetailEvent(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDetailEvent();
  }, []);

  const { poster, headline, start_date, end_date, tickets, regions } =
    detailEvent;

  const handleSubmit = async () => {
    const validResult = validateFormData(ticketData);

    if (Object.values(validResult).some((item) => !item)) {
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/tickets/create",
        ticketData
      );
      !response.status === 201 && alert(response.data);
    } catch (error) {
      alert(error);
    } finally {
      alert("Berhasil Input");
      setOpen(!open);
      getDetailEvent();
    }
  };

  const dateFormat = () => {
    if (end_date) {
      return (
        moment(start_date).format("DD MMMM") +
        " - " +
        moment(end_date).format("DD MMMM YYYY")
      );
    } else {
      return moment(start_date).format("DD MMMM YYYY");
    }
  };

  const handleOpen = () => {
    setTicketData({
      eventId: eventId,
      category: "",
      qty: "",
      price: "",
    });

    setValidationErrors({
      category: "",
      qty: "",
      price: "",
    });

    setOpen(!open);
  };
  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="orange" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Detail Event
          </Typography>
        </CardHeader>
        <CardBody className="flex gap-4">
          <div className="flex w-full ">
            {poster && (
              <img
                src={`http://localhost:8080/uploads/poster/${poster}`}
                alt=""
              />
            )}
          </div>
          <div className="flex w-full flex-col gap-5">
            <h2>{headline}</h2>
            <div>
              <p>{regions?.region_city}</p>
              <p>{dateFormat()}</p>
            </div>
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardHeader variant="gradient" color="orange" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Events Ticket
          </Typography>
        </CardHeader>
        <CardBody>
          <div className="w-32">
            <Button
              onClick={handleOpen}
              size="sm"
              className="flex w-full items-center justify-between"
              color="orange"
            >
              <PlusIcon strokeWidth={2.5} className="h-5 w-5" /> Add Ticket
            </Button>
            <Dialog open={open} handler={handleOpen} size="md">
              <DialogHeader>Add Ticket</DialogHeader>
              <DialogBody className="grid grid-cols-2  gap-4" divider>
                <div className="col-span-2">
                  <Input
                    type="text"
                    label="Category"
                    name="category"
                    onChange={(e) => handleInputChange(e)}
                    value={ticketData.category}
                    error={validationErrors.category === false}
                  />
                  {validationErrors.category === false && (
                    <p className="-mb-3 p-1 text-xs text-red-500">
                      Category is required
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <Input
                    type="number"
                    label="Quantity"
                    name="qty"
                    min={0}
                    onChange={(e) => handleInputChange(e)}
                    value={ticketData.qty}
                    error={validationErrors.qty === false}
                  />
                  {validationErrors.qty === false && (
                    <p className="-mb-3 p-1 text-xs text-red-500">
                      Quantity is required
                    </p>
                  )}
                </div>
                <div className="w-full ">
                  <Input
                    type="number"
                    label="Price"
                    name="price"
                    onChange={(e) => handleInputChange(e)}
                    value={ticketData.price}
                    error={validationErrors.price === false}
                  />
                  {validationErrors.price === false && (
                    <p className="-mb-3 p-1 text-xs text-red-500">
                      Price is required
                    </p>
                  )}
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
                {["No.", "category", "qty", "price", "", ""].map((el, i) => (
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
                ))}
              </tr>
            </thead>
            <tbody>
              {tickets &&
                tickets.map(({ id, category, qty, price }, index) => {
                  const className = `py-3 px-4 ${
                    id === tickets.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  const numRows = index + 1;

                  return (
                    <tr key={id}>
                      <td className="w-5 text-center">{numRows}</td>
                      <td className={`${className} w-64`}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-semibold"
                        >
                          {category}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-normal text-blue-gray-500">
                          {qty}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {price}
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
                })}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
};

export default DetailEvent;
