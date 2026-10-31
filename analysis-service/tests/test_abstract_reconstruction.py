import pytest
from app.utils.openalex_utils import reconstruct_abstract_text


def test_reconstruct_abstract_text():
    inverted_index = {
        "is": [1],
        "This": [0],
        "a": [2],
        "system.": [4],
        "smart": [3],
    }
    result = reconstruct_abstract_text(inverted_index)
    assert result == "This is a smart system."


def test_reconstruct_abstract_text_empty():
    assert reconstruct_abstract_text(None) == ""
    assert reconstruct_abstract_text({}) == ""
    assert reconstruct_abstract_text("not a dict") == ""


def test_reconstruct_abstract_multiple_positions():
    inverted_index = {
        "the": [0, 3],
        "dog": [1],
        "barked": [2],
        "at": [4],
        "moon.": [5],
    }
    result = reconstruct_abstract_text(inverted_index)
    assert result == "the dog barked the at moon."
