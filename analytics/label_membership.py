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
    def __init__(self, model="facebook/bart-large-mnli", *args, **kwargs):
        self.classifier = pipeline(
            "zero-shot-classification", 
            model, *args, **kwargs)

    def get_label_membership(self, text, label_set):
        return self.classifier(text, label_set)

lm = LabelMembershipPipeline(device=0)
