import { useState, useEffect, useMemo } from "react";
import { useTable, useGlobalFilter, useSortBy } from "react-table";
import ReactPaginate from "react-paginate";
import { Navbar } from "./Navbar";
import GlobalFilter from "./GlobalFilter"; // Import GlobalFilter
import "./ViewProject.css";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { uploadFileCloudinary } from "../Handlers/uploadFileCloudinary";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "flowbite-react";
import ReportPDFGenarator from "./ReportPDFGenarator";

const DOMAIN_NAME = import.meta.env.VITE_DOMAIN_NAME;

// Project View Component
const ViewProject = () => {
  // Project Data and state for Modal
  const [projects, setProjects] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  // Fetch Projects Data (using fetch)
  useEffect(() => {
    fetchdata();
    if (localStorage.getItem("token") === null) {
      navigate("/login");
    }
  }, [navigate]);

  const fetchdata = async () => {
    try {
      const response = await fetch(
        `${DOMAIN_NAME}/api/projects/getallprojects`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      const projectsWithId = data.projects.map((project) => ({
        ...project,
        id: project._id,
        created_at: format(new Date(project.created_at), "MM/dd/yyyy"), // Format the date here
      }));

      setProjects(projectsWithId);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Columns for the Table
  const columns = useMemo(
    () => [
      { Header: "Student Name", accessor: "student_name" },
      { Header: "Student ID", accessor: "student_id" },
      { Header: "Project Name", accessor: "project_name" },
      { Header: "Category", accessor: "project_category" },
      { Header: "Description", accessor: "project_description" },
      { Header: "Faculty Name", accessor: "faculty_name" },
      { Header: "Created At", accessor: "created_at" },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <div className="space-x-2">
            <button
              className="text-blue-500"
              onClick={() => {
                handleEdit(row.original);
                console.log(row.original.ppt_url[1]);
              }}
            >
              Edit
            </button>
            <button
              className="text-red-500"
              onClick={() => {
                const id = row.original._id;
                const public_id = row.original.ppt_url[1];
                if (confirm("Are you sure you want to delete this project?")) {
                  if (public_id) {
                    handleDelete(id, public_id);
                  } else {
                    handleDelete(id, null);
                  }
                } else {
                  return;
                }
              }}
            >
              Delete
            </button>
            {row.original.ppt_url[0] && (
              <a
                href={row.original.ppt_url[0]}
                download
                className="text-green-500"
              >
                Download PPT
              </a>
            )}
          </div>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = useTable(
    { columns, data: projects },
    useGlobalFilter, // Enables search
    useSortBy // Enables sorting
  );

  // Open Edit Modal and set selected project
  const handleEdit = (project) => {
    setSelectedProject(project);
    setIsEditModalOpen(true);
  };

  // Handle delete project (using fetch)
  const handleDelete = (id, public_id) => {
    fetch(`${DOMAIN_NAME}/api/projects/project/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        console.log(response);
        if (response.ok) {
          fetchdata();
          console.log(public_id);
          if (public_id) {
            console.log("Delete file");
            deleteFile(public_id);
          }
        } else {
          console.error("Error deleting project:", response.statusText);
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  const deleteFile = async (public_id) => {
    try {
      console.log("Deleting file:", public_id);
      const response = await fetch(`${DOMAIN_NAME}/delete-file`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ public_id: public_id }),
      });

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const addProject = async (newProject) => {
    if (!file) {
      console.log("No file uploaded");
      document.getElementById("ppt_file");
    } else {
      const uploaddata = await handleFileUpload();
      const ppturl = uploaddata.secure_url;
      const ppt_public_id = uploaddata.public_id;
      console.log(uploaddata);

      const newProjectWithPPT = {
        ...newProject,
        ppt_url: [ppturl, ppt_public_id],
      };

      console.log(newProjectWithPPT);

      console.log(newProject);

      const response = await fetch(`${DOMAIN_NAME}/api/projects/project`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newProjectWithPPT),
      });

      const data = await response.json();
      console.log(data);

      if (data.status === "success") {
        alert("Project Added Successfully");
        setFile(null);
        fetchdata();
      } else {
        alert("Project not Added");
        console.log(data);
      }
    }
  };

  // Save project changes from Modal (using fetch)
  const handleSave = (e) => {
    e.preventDefault();

    const updatedProject = {
      _id: selectedProject._id,
      student_name: selectedProject.student_name,
      student_id: selectedProject.student_id,
      project_name: selectedProject.project_name,
      project_category: selectedProject.project_category,
      project_description: selectedProject.project_description,
      project_link: selectedProject.project_link,
      faculty_name: selectedProject.faculty_name,
      created_at: selectedProject.created_at,
    };

    console.log(file);
    if (file) {
      deleteFile(selectedProject.ppt_url[1]);

      handleFileUpload().then((pptUrl) => {
        updatedProject.ppt_url = [pptUrl.secure_url, pptUrl.public_id];
      });
    } else {
      console.log("Public id:", selectedProject.ppt_url[1]);
      updatedProject.ppt_url = selectedProject.ppt_url;
    }

    const id = selectedProject._id;

    fetch(`${DOMAIN_NAME}/api/projects/project/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(updatedProject),
    })
      .then((response) => {
        // console.log(response);
        if (response.ok) {
          fetchdata();
          setIsEditModalOpen(false);
          setFile(null);
        } else {
          console.error("Error updating project:", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        console.log(error);
      });
  };

  const handleFileUpload = async () => {
    if (file) {
      console.log("File uploaded:", file);

      const pptUrl = await uploadFileCloudinary(file);
      console.log("PPT URL:", pptUrl);
      //     // Handle the URL here (e.g., add it to the project data)

      //   })
      //   .catch((error) => console.error("Error uploading file:", error));
      return pptUrl;
    }
  };

  // Pagination state
  const [pageNumber, setPageNumber] = useState(0);
  const itemsPerPage = 5;
  const pagesVisited = pageNumber * itemsPerPage;
  const pageCount = Math.ceil(rows.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setPageNumber(selected);
  };

  // Modal close
  const closeModal = () => {
    setIsEditModalOpen(false);
    setSelectedProject(null);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const pdfData = projects.map((project) => ({
    student_name: project.student_name,
    student_id: project.student_id,
    project_name: project.project_name,
    project_category: project.project_category,
    project_description: project.project_description,
    faculty_name: project.faculty_name,
    created_at: project.created_at,
  }));

  const pdfColumns = [
    { header: "Student Name", accessorKey: "student_name" },
    { header: "Student ID", accessorKey: "student_id" },
    { header: "Project Name", accessorKey: "project_name" },
    { header: "Category", accessorKey: "project_category" },
    { header: "Description", accessorKey: "project_description" },
    { header: "Faculty Name", accessorKey: "faculty_name" },
    { header: "Created At", accessorKey: "created_at" },
  ];

  return (
    <>
      <Navbar />

      <hr className="w-full h-1  bg-gray-600 border-0 rounded dark:bg-black" />

      <div className="p-4">
        {/* Search Input */}
        <div className="flex items-baseline justify-between space-x-2"></div>
        <div className="flex items-baseline justify-between space-x-2">
          <GlobalFilter
            globalFilter={state.globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
          <div>
            <label className="text-lg font-semibold">
              Total Projects: {projects.length}
            </label>
          </div>
          <div className="flex space-x-2">
            <button
              className="text-white bg-blue-600 px-4 py-2 rounded-lg"
              onClick={() => setIsAddModalOpen(true)}
            >
              Add New Project
            </button>
            <PDFDownloadLink
              document={
                <ReportPDFGenarator
                  data={pdfData}
                  columns={pdfColumns}
                  table_name={"Project Data"}
                />
              }
              fileName="customers_entry_data.pdf"
            >
              {({ loading }) => (
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1 text-white bg-blue-600 px-4 rounded-lg"
                  disabled={loading}
                >
                  <svg
                    className="w-6 h-6 mr-1 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 7V2.221a2 2 0 0 0-.5.365L4.586 6.5a2 2 0 0 0-.365.5H9Zm2 0V2h7a2 2 0 0 1 2 2v9.293l-2-2a1 1 0 0 0-1.414 1.414l.293.293h-6.586a1 1 0 1 0 0 2h6.586l-.293.293A1 1 0 0 0 18 16.707l2-2V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9h5a2 2 0 0 0 2-2Z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap font-semibold">
                    Export
                  </span>
                </Button>
              )}
            </PDFDownloadLink>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto shadow-md sm:rounded-lg mt-4">
          <table
            {...getTableProps()}
            className="w-full text-sm text-left text-gray-500 border border-gray-200 dark:border-gray-700"
          >
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      key={column.id} // Adding key here
                      className="px-6 py-3"
                    >
                      {column.render("Header")}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? " ▼"
                            : " ▲"
                          : ""}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody {...getTableBodyProps()}>
              {rows
                .slice(pagesVisited, pagesVisited + itemsPerPage)
                .map((row) => {
                  prepareRow(row);
                  return (
                    <tr
                      {...row.getRowProps()}
                      key={row.original._id}
                      className="bg-white border-b"
                    >
                      {row.cells.map((cell) => (
                        <td
                          {...cell.getCellProps()}
                          key={cell.column.id}
                          className="px-6 py-4"
                        >
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  );
                })}
            </tbody>
          </table>

          {/* Pagination */}
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={pageCount}
            onPageChange={handlePageClick}
            containerClassName={"paginationBtns"}
            previousLinkClassName={"previousBtn"}
            nextLinkClassName={"nextBtn"}
            disabledClassName={"paginationDisabled"}
            activeClassName={"paginationActive"}
          />
        </div>

        {/* Edit Modal */}
        {isEditModalOpen && selectedProject && (
          <div
            id="editUserModal"
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full p-4 overflow-x-hidden overflow-y-auto h-full"
          >
            <div className="relative w-full max-w-2xl max-h-full">
              <form
                className="relative bg-white rounded-lg shadow"
                onSubmit={handleSave}
              >
                <div className="flex items-start justify-between p-4 border-b">
                  <h3 className="text-xl font-semibold">Edit Project</h3>
                  <button
                    type="button"
                    className="text-gray-400 hover:bg-gray-200 rounded-lg w-8 h-8"
                    onClick={closeModal}
                  >
                    X
                  </button>
                </div>
                <div className="p-6 space-y-6">
                  {/* Modal body fields */}
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label className="block mb-2 text-sm font-medium">
                        Student Name
                      </label>
                      <input
                        type="text"
                        value={selectedProject.student_name}
                        onChange={(e) =>
                          setSelectedProject({
                            ...selectedProject,
                            student_name: e.target.value,
                          })
                        }
                        className="p-2 w-full border rounded-lg"
                        required
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label className="block mb-2 text-sm font-medium">
                        Student ID
                      </label>
                      <input
                        type="text"
                        value={selectedProject.student_id}
                        onChange={(e) =>
                          setSelectedProject({
                            ...selectedProject,
                            student_id: e.target.value,
                          })
                        }
                        className="p-2 w-full border rounded-lg"
                        required
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label className="block mb-2 text-sm font-medium">
                        Project Name
                      </label>
                      <input
                        type="text"
                        value={selectedProject.project_name}
                        onChange={(e) =>
                          setSelectedProject({
                            ...selectedProject,
                            project_name: e.target.value,
                          })
                        }
                        className="p-2 w-full border rounded-lg"
                        required
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label className="block mb-2 text-sm font-medium">
                        Category
                      </label>
                      <input
                        type="text"
                        value={selectedProject.project_category}
                        onChange={(e) =>
                          setSelectedProject({
                            ...selectedProject,
                            project_category: e.target.value,
                          })
                        }
                        className="p-2 w-full border rounded-lg"
                        required
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-6">
                      <label className="block mb-2 text-sm font-medium">
                        Description
                      </label>
                      <textarea
                        value={selectedProject.project_description}
                        onChange={(e) =>
                          setSelectedProject({
                            ...selectedProject,
                            project_description: e.target.value,
                          })
                        }
                        className="p-2 w-full border rounded-lg"
                        required
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label className="block mb-2 text-sm font-medium">
                        Project Link
                      </label>
                      <input
                        type="url"
                        value={selectedProject.project_link || ""}
                        onChange={(e) =>
                          setSelectedProject({
                            ...selectedProject,
                            project_link: e.target.value,
                          })
                        }
                        className="p-2 w-full border rounded-lg"
                        required
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label className="block mb-2 text-sm font-medium">
                        Upload PPT
                      </label>
                      <input
                        type="file"
                        accept=".ppt, .pptx"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="p-2 w-full border rounded-lg"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end p-6 border-t">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="ml-2 text-gray-500 bg-gray-100 hover:bg-gray-200 px-5 py-2 rounded-lg"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Project Modal */}
        {isAddModalOpen && (
          <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full p-4 overflow-x-hidden overflow-y-auto h-full">
            <div className="relative w-full max-w-2xl max-h-full">
              <form
                className="relative bg-white rounded-lg shadow"
                onSubmit={(e) => {
                  e.preventDefault();
                  const newProject = {
                    student_name: e.target.student_name.value,
                    student_id: e.target.student_id.value,
                    project_name: e.target.project_name.value,
                    project_category: e.target.project_category.value,
                    project_description: e.target.project_description.value,
                    faculty_name: e.target.faculty_name.value,
                    project_link: e.target.project_link.value,
                  };
                  addProject(newProject);
                  closeAddModal();
                }}
              >
                <div className="flex items-start justify-between p-4 border-b">
                  <h3 className="text-xl font-semibold">Add New Project</h3>
                  <button
                    type="button"
                    className="text-gray-400 hover:bg-gray-200 rounded-lg w-8 h-8"
                    onClick={closeAddModal}
                  >
                    X
                  </button>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label className="block mb-2 text-sm font-medium">
                        Student Name
                      </label>
                      <input
                        type="text"
                        name="student_name"
                        className="block w-full p-2 border rounded-lg"
                        required
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label className="block mb-2 text-sm font-medium">
                        Student ID
                      </label>
                      <input
                        type="text"
                        name="student_id"
                        className="block w-full p-2 border rounded-lg"
                        required
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label className="block mb-2 text-sm font-medium">
                        Project Name
                      </label>
                      <input
                        type="text"
                        name="project_name"
                        className="block w-full p-2 border rounded-lg"
                        required
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label className="block mb-2 text-sm font-medium">
                        Project Category
                      </label>
                      <input
                        type="text"
                        name="project_category"
                        className="block w-full p-2 border rounded-lg"
                        required
                      />
                    </div>
                    <div className="col-span-6">
                      <label className="block mb-2 text-sm font-medium">
                        Description
                      </label>
                      <textarea
                        name="project_description"
                        className="block w-full p-2 border rounded-lg"
                        required
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label className="block mb-2 text-sm font-medium">
                        Faculty Name
                      </label>
                      <input
                        type="text"
                        name="faculty_name"
                        className="block w-full p-2 border rounded-lg"
                        required
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label className="block mb-2 text-sm font-medium">
                        Project Link
                      </label>
                      <input
                        type="url"
                        name="project_link"
                        className="block w-full p-2 border rounded-lg"
                        required
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label className="block mb-2 text-sm font-medium">
                        Upload PPT
                      </label>
                      <input
                        type="file"
                        accept=".ppt, .pptx"
                        name="ppt_file"
                        id="ppt_file"
                        className="block w-full p-2 border rounded-lg"
                        onChange={(e) => setFile(e.target.files[0])}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end p-4 border-t border-gray-200">
                  <button
                    type="submit"
                    className="text-white bg-blue-600 px-4 py-2 rounded-lg"
                  >
                    Add Project
                  </button>
                  <button
                    type="button"
                    className="text-gray-400 hover:bg-gray-200 rounded-lg px-4 py-2 ml-2"
                    onClick={closeAddModal}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ViewProject;
