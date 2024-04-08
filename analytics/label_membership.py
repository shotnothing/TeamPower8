from transformers import pipeline

LABEL_SET_1 = [
    "Landmarks", "Nature","Culture",
    "Wildlife","Entertainment", "Museums",
    "Food","Adventure","Experience",
    "History"]

LABEL_SET_2 = [
    "Outdoor sports","Theme parks","Arts", 
    "Tradition", "Heritage", "Food", 
    "Educational", "Scenic","Games", 
    "Workshop","Shows","Explore","Disovery", 
    "Relaxing","Adventure","Thrill", 
    "Marine Life", "Animals", "Galleries", 
    "Icons"]

class LabelMembershipPipeline:
    ''' Pipeline for determining label membership.'''

    def __init__(self, model="facebook/bart-large-mnli", *args, **kwargs):
        '''Constructor for the LabelMembershipPipeline class.
        
        Args:
            model (str): The model to use for the classifier.
            *args: Variable length argument list for transformers.pipeline.
            **kwargs: Arbitrary keyword arguments for transformers.pipeline.
        '''
        self.classifier = pipeline(
            "zero-shot-classification", 
            model, *args, **kwargs)

    def get_label_membership(self, text, label_set):
        ''' Returns the label membership scores for the text.

        Args:
            text (str): The text to classify.
            label_set (list): The set of labels to classify against.

        Returns:
            dict: The labels and their membership scores.
        '''
        return self.classifier(text, label_set)
