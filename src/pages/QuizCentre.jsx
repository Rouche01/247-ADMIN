import React, { useState, useContext, useMemo, useEffect } from "react";
import Dashboard from "../components/Dashboard";
import DataTable from "../components/DataTable";
import RoundedBtnWithIcon from "../components/uiComponents/RoundedBtnWithIcon";
import Pagination from "../components/uiComponents/Pagination";
import ConfirmationModal from "../components/uiComponents/ConfirmationModal";
import { Context as QuizContext } from "../context/QuizContext";
import { usePagination } from "../hooks/pagination";
import { MdAdd } from "react-icons/md";
import { quizQuestions } from "../utils/dummyData";
import QuizItemRow from "../components/QuizItemRow";
import Spinner from "../components/uiComponents/Spinner";
import NoDataBox from "../components/uiComponents/NoDataBox";
import ErrorBox from "../components/uiComponents/ErrorBox";
import { FaRegTrashAlt } from "react-icons/fa";
import NewQuizModal from "../components/uiComponents/NewQuizModal";
import Checkbox from "../components/uiComponents/Checkbox";
import toast from "react-hot-toast";
import { useToastError } from "../hooks/handleError";

const CheckAll = ({ checkedItems, toggleAll }) => {
  return (
    <Checkbox
      checked={checkedItems.length === quizQuestions.length}
      iconColor="#CACACA"
      name="checkAll"
      handleChange={toggleAll}
    />
  );
};

const QuizCentre = () => {
  const [checkedQuizItems, setCheckedQuizItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [shownRows, setShownRows] = useState(5);

  const [selectedQuizItem, setSelectedQuizItem] = useState();
  const [quizMedia, setQuizMedia] = useState([]);

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [quizModalOpen, setQuizModalOpen] = useState(false);

  const {
    state: {
      creatingQuiz,
      createQuizError,
      quizzes,
      quizzesCount,
      fetchQuizzesError,
      fetchingQuizzes,
      deletingQuiz,
      deleteQuizError,
    },
    createNewQuiz,
    fetchQuizzes,
    deleteQuiz,
    clearError,
  } = useContext(QuizContext);

  useToastError(createQuizError, () => {
    clearError("createQuiz");
  });

  useToastError(deleteQuizError, () => {
    clearError("deleteQuiz");
  });

  const paginationOptions = useMemo(
    () => ({
      limit: shownRows,
      skip: (currentPage - 1) * shownRows,
    }),
    [shownRows, currentPage]
  );

  useEffect(() => {
    fetchQuizzes({ ...paginationOptions });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationOptions]);

  const { indexOfFirstItem, indexOfLastItem, pages } = usePagination(
    currentPage,
    shownRows,
    quizzes,
    quizzesCount
  );

  const toggleQuizCheck = (idx) => {
    if (checkedQuizItems.includes(idx)) {
      const index = checkedQuizItems.indexOf(idx);
      const newCheckedAdvertisers = [...checkedQuizItems];
      newCheckedAdvertisers.splice(index, 1);
      setCheckedQuizItems(newCheckedAdvertisers);
    } else {
      setCheckedQuizItems([...checkedQuizItems, idx]);
    }
  };

  const toggleAllQuizCheckbox = () => {
    if (checkedQuizItems.length === 0) {
      const listOfAllQuizIdx = Array.from(
        { length: quizQuestions.length },
        (_, i) => i
      );
      setCheckedQuizItems(listOfAllQuizIdx);
      return;
    }

    setCheckedQuizItems([]);
  };

  const deleteQuizSuccessCb = () => {
    toast.success("Quiz has been sucessfully deleted!");
    return fetchQuizzes({ ...paginationOptions });
  };

  const deleteQuestionFromQuiz = async () => {
    await deleteQuiz(selectedQuizItem._id, deleteQuizSuccessCb);
    setConfirmModalOpen(false);
  };

  const createQuizSuccessCb = () => {
    toast.success("New quiz added successfully!");
    return fetchQuizzes({ ...paginationOptions });
  };

  const handleCreateNewQuizQuestion = async (data) => {
    const answer = `option${data.correctOption.value.toUpperCase()}`;

    const formData = new FormData();
    formData.append("question", data.question);
    formData.append("option1", data.optionA);
    formData.append("option2", data.optionB);
    formData.append("option3", data.optionC);
    formData.append("option4", data.optionD);
    formData.append("answer", data[answer]);
    formData.append("quizImage", quizMedia[0]);

    await createNewQuiz(formData, createQuizSuccessCb);
    setQuizModalOpen(false);
  };

  const tableHeaders = [
    <CheckAll
      checkedItems={checkedQuizItems}
      toggleAll={toggleAllQuizCheckbox}
    />,
    "Question",
    "Answers",
    "Correct Answer",
    "Correct Option",
    "",
  ];

  return (
    <Dashboard>
      <div className="w-full flex items-center mt-20 justify-end">
        <RoundedBtnWithIcon
          title="New Quiz"
          icon={<MdAdd className="mr-2" size={22} />}
          onBtnClick={() => setQuizModalOpen(true)}
        />
      </div>
      <div className="mt-8 mb-10 bg-247-secondary">
        <DataTable headers={tableHeaders} loadingData={fetchingQuizzes}>
          {fetchingQuizzes && (
            <div className="flex items-center justify-center w-full absolute py-14">
              <Spinner size="large" />
            </div>
          )}
          {!fetchingQuizzes &&
            quizzes.length > 0 &&
            quizzes.map((quiz, idx) => (
              <QuizItemRow
                quizItem={quiz}
                index={idx}
                key={quiz.id}
                checkedItems={checkedQuizItems}
                toggleItemCheck={toggleQuizCheck}
                setConfirmDeleteItem={setConfirmModalOpen}
                setCurrentItem={setSelectedQuizItem}
              />
            ))}
        </DataTable>
        {!fetchingQuizzes && !fetchQuizzesError && quizzes.length === 0 && (
          <div className="w-full py-9">
            <NoDataBox
              title="No Campaign Found"
              subtitle="We cannot find any campaign that fits your criteria."
            />
          </div>
        )}
        {!fetchingQuizzes && fetchQuizzesError && (
          <div className="w-full py-9">
            <ErrorBox
              title="Error Retrieving Campaigns"
              subtitle={fetchQuizzesError}
            />
          </div>
        )}
      </div>
      <div className="flex items-center justify-end mb-20">
        {quizzes && quizzes.length > 0 && (
          <Pagination
            activePage={currentPage}
            dataLength={quizzesCount}
            firstItem={indexOfFirstItem + 1}
            lastItem={indexOfLastItem}
            pages={pages}
            setActivePage={setCurrentPage}
            setVisibleRows={setShownRows}
            visibleRows={shownRows}
          />
        )}
      </div>
      <ConfirmationModal
        open={confirmModalOpen}
        setOpen={setConfirmModalOpen}
        text="Are you sure you want to delete this question?"
        icon={<FaRegTrashAlt size={28} color="#fff" />}
        handleConfirmation={deleteQuestionFromQuiz}
        processingConfirm={deletingQuiz}
      />
      <NewQuizModal
        isOpen={quizModalOpen}
        setIsOpen={setQuizModalOpen}
        submitAction={handleCreateNewQuizQuestion}
        setMediaItem={setQuizMedia}
        creatingQuiz={creatingQuiz}
      />
    </Dashboard>
  );
};

export default QuizCentre;
