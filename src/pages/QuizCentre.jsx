import React, { useState } from "react";
import Dashboard from "../components/Dashboard";
import DataTable from "../components/DataTable";
import RoundedBtnWithIcon from "../components/uiComponents/RoundedBtnWithIcon";
import Pagination from "../components/uiComponents/Pagination";
import ConfirmationModal from "../components/uiComponents/ConfirmationModal";
import { usePagination } from "../hooks/pagination";
import { MdAdd } from "react-icons/md";
import { quizQuestions } from "../utils/dummyData";
import QuizItemRow from "../components/QuizItemRow";
import { FaRegTrashAlt } from "react-icons/fa";
import NewQuizModal from "../components/uiComponents/NewQuizModal";
import Checkbox from "../components/uiComponents/Checkbox";

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

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [quizModalOpen, setQuizModalOpen] = useState(false);

  const { currentList, indexOfFirstItem, indexOfLastItem, pages } =
    usePagination(currentPage, shownRows, quizQuestions);

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

  const deleteQuestionFromQuiz = () => {
    setConfirmModalOpen(false);
    console.log("deleting question from quiz");
  };

  const handleCreateNewQuizQuestion = (data) => {
    setQuizModalOpen(false);
    console.log(data, "creating new quiz question...");
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
      <div className="mt-8 mb-10">
        <DataTable headers={tableHeaders}>
          {currentList.map((quiz, idx) => (
            <QuizItemRow
              quizItem={quiz}
              index={idx}
              checkedItems={checkedQuizItems}
              toggleItemCheck={toggleQuizCheck}
              setConfirmDeleteItem={setConfirmModalOpen}
            />
          ))}
        </DataTable>
      </div>
      <div className="flex items-center justify-end mb-20">
        <Pagination
          activePage={currentPage}
          dataLength={quizQuestions.length}
          firstItem={indexOfFirstItem + 1}
          lastItem={indexOfLastItem}
          pages={pages}
          setActivePage={setCurrentPage}
          setVisibleRows={setShownRows}
          visibleRows={shownRows}
        />
      </div>
      <ConfirmationModal
        open={confirmModalOpen}
        setOpen={setConfirmModalOpen}
        text="Are you sure you want to delete this question?"
        icon={<FaRegTrashAlt size={28} color="#fff" />}
        handleConfirmation={deleteQuestionFromQuiz}
      />
      <NewQuizModal
        isOpen={quizModalOpen}
        setIsOpen={setQuizModalOpen}
        submitAction={handleCreateNewQuizQuestion}
      />
    </Dashboard>
  );
};

export default QuizCentre;
